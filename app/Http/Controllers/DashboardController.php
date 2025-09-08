<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Borrowing;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = Carbon::today();

        $metrics = [
            'total_books' => Book::count(),
            'total_copies' => (int) Book::sum('stock_quantity'),
            'available_copies' => (int) Book::sum('available_quantity'),
            'active_borrowings' => Borrowing::where('status', 'active')->count(),
            'overdue_borrowings' => Borrowing::where('status', 'active')->whereDate('return_date', '<', $today)->count(),
            'revenue_30d' => (float) Borrowing::whereDate('borrowed_date', '>=', $today->copy()->subDays(30))->sum('total_cost'),
        ];

        $topBooks = Borrowing::join('books', 'borrowings.book_id', '=', 'books.id')
            ->select('books.title', DB::raw('COUNT(*) as total'))
            ->groupBy('books.title')
            ->orderByDesc('total')
            ->limit(5)
            ->get()
            ->map(fn ($r) => ['title' => $r->title, 'count' => (int) $r->total]);

        // Recent 5 borrowings
        $recent = Borrowing::with(['user:id,name', 'book:id,title'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get(['id', 'user_id', 'book_id', 'borrowed_date', 'return_date', 'total_cost', 'status']);

        return Inertia::render('dashboard', [
            'metrics' => $metrics,
            'top_books' => $topBooks,
            'recent' => $recent,
        ]);
    }
}
