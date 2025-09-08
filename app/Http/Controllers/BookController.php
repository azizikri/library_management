<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Book::query();

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('isbn', 'like', "%{$search}%");
            });
        }

        if ($category = $request->string('category')->toString()) {
            $query->where('category', $category);
        }

        return Inertia::render('books/index', [
            'books' => $query->orderBy('title')->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('books/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'required|string|max:255|unique:books,isbn',
            'category' => 'required|string|max:255',
            'daily_rental_price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'available_quantity' => 'required|integer|min:0|lte:stock_quantity',
            'description' => 'nullable|string',
        ]);

        Book::create($data);

        return redirect()->route('books.index')->with('success', 'Book created');
    }

    public function edit(Book $book): Response
    {
        return Inertia::render('books/edit', [
            'book' => $book,
        ]);
    }

    public function update(Request $request, Book $book): RedirectResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'required|string|max:255|unique:books,isbn,'.$book->id,
            'category' => 'required|string|max:255',
            'daily_rental_price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'available_quantity' => 'required|integer|min:0|lte:stock_quantity',
            'description' => 'nullable|string',
        ]);

        $book->update($data);

        return redirect()->route('books.index')->with('success', 'Book updated');
    }

    public function destroy(Book $book): RedirectResponse
    {
        $book->delete();

        return back()->with('success', 'Book deleted');
    }
}
