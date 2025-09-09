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
        $userId = $request->user()->id;

        $today = now()->toDateString();
        Borrowing::where('user_id', $userId)
            ->where('status', 'active')
            ->whereDate('return_date', '<', $today)
            ->update(['status' => 'overdue']);
        $overdueCount = Borrowing::where('user_id', $userId)->where('status', 'overdue')->count();

        $borrowings = Borrowing::with('book')
            ->where('user_id', $userId)
            ->orderByRaw("CASE WHEN status = 'overdue' THEN 1 ELSE 0 END DESC")
            ->orderByDesc('borrowed_date')
            ->paginate(10);

        return Inertia::render('borrowings/index', [
            'borrowings' => $borrowings,
            'overdue_count' => $overdueCount,
        ]);
    }

    public function create(Request $request): Response
    {
        $userId = $request->user()->id;
        // Pastikan status overdue tersinkron terlebih dahulu
        $today = now()->toDateString();
        Borrowing::where('user_id', $userId)
            ->where('status', 'active')
            ->whereDate('return_date', '<', $today)
            ->update(['status' => 'overdue']);
        $overdueCount = Borrowing::where('user_id', $userId)->where('status', 'overdue')->count();
        $blocked = $overdueCount >= 2;

        $books = Book::where('available_quantity', '>', 0)
            ->orderBy('title')
            ->get(['id', 'title', 'author', 'daily_rental_price', 'available_quantity']);

        return Inertia::render('borrowings/create', [
            'books' => $books,
            'overdue_count' => $overdueCount,
            'blocked' => $blocked,
        ]);
    }

    public function store(Request $request, CalculatorService $calculator): RedirectResponse
    {
        $overdueCount = Borrowing::where('user_id', $request->user()->id)->where('status', 'overdue')->count();
        if ($overdueCount >= 2) {
            return back()->with('error', 'Anda memiliki 2 atau lebih peminjaman terlambat. Kembalikan buku yang terlambat terlebih dahulu.');
        }

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
