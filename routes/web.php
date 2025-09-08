<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BorrowingController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    // Admin-only routes
    Route::middleware(['role:admin'])->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::resource('books', BookController::class)->except(['show']);
        Route::resource('users', UserController::class)->except(['show']);
    });

    // User-only routes
    Route::middleware(['role:user'])->group(function () {
        Route::get('/borrowings/create', [BorrowingController::class, 'create'])->name('borrowings.create');
        Route::post('/borrowings', [BorrowingController::class, 'store'])->name('borrowings.store');
        Route::get('/borrowings', [BorrowingController::class, 'index'])->name('borrowings.index');
        Route::post('/calculate-cost', [BorrowingController::class, 'calculateCost'])->name('borrowings.calculate');
    });

    // Shared routes (both admin and user)
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export/{type}', [ReportController::class, 'export'])->name('reports.export');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
