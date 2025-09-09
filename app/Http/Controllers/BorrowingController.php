<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Borrowing;
use App\Services\CalculatorService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BorrowingController extends Controller
{
    public function index(Request $request): Response
    {
        $borrowings = Borrowing::with('book')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('borrowings/index', [
            'borrowings' => $borrowings,
        ]);
    }

    public function create(): Response
    {
        $books = Book::where('available_quantity', '>', 0)
            ->orderBy('title')
            ->get(['id', 'title', 'author', 'daily_rental_price', 'available_quantity']);

        return Inertia::render('borrowings/create', [
            'books' => $books,
        ]);
    }

    public function store(Request $request, CalculatorService $calculator): RedirectResponse
    {
        $data = $request->validate([
            'book_id' => 'required|exists:books,id',
            'days_borrowed' => 'required|integer|min:1|max:365',
        ]);

        $book = Book::findOrFail($data['book_id']);

        if ($book->available_quantity < 1) {
            return back()->withErrors(['book_id' => 'Book is not available']);
        }

        // Multiply price cents by days via SOAP calculator
        $priceCents = (int) round($book->daily_rental_price * 100);
        $totalCents = $calculator->multiply($priceCents, (int) $data['days_borrowed']);
        $totalCost = $totalCents / 100;

        $borrowedDate = Carbon::now()->toDateString();
        $returnDate = Carbon::now()->addDays((int) $data['days_borrowed'])->toDateString();

        Borrowing::create([
            'user_id' => Auth::id(),
            'book_id' => $book->id,
            'borrowed_date' => $borrowedDate,
            'return_date' => $returnDate,
            'days_borrowed' => (int) $data['days_borrowed'],
            'total_cost' => $totalCost,
            'status' => 'active',
        ]);

        // Reduce availability
        $book->decrement('available_quantity');

        return redirect()->route('borrowings.index')->with('success', 'Borrowing created');
    }

    public function calculateCost(Request $request, CalculatorService $calculator): JsonResponse
    {
        $data = $request->validate([
            'book_id' => 'required|exists:books,id',
            'days' => 'required|integer|min:1|max:365',
        ]);

        $book = Book::findOrFail($data['book_id']);
        $priceCents = (int) round($book->daily_rental_price * 100);
        $totalCents = $calculator->multiply($priceCents, (int) $data['days']);

        return response()->json([
            'total_cost' => $totalCents / 100,
        ]);
    }

    // Admin: mark a borrowing as returned
    public function return(Borrowing $borrowing): RedirectResponse
    {
        // Update status and actual return date, and restore availability
        if ($borrowing->status !== 'returned') {
            $borrowing->status = 'returned';
            $borrowing->actual_return_date = now();
            $borrowing->save();

            // increment available quantity for the book
            $borrowing->book()->increment('available_quantity');
        }

        return redirect()->back()->with('success', 'Borrowing marked as returned');
    }
}
