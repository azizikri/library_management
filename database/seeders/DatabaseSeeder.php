<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Book;
use App\Models\Borrowing;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'user@gmail.com'],
            ['name' => 'User', 'password' => Hash::make('password'), 'role' => 'user']
        );

        User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            ['name' => 'Admin User', 'password' => Hash::make('password'), 'role' => 'admin']
        );

        // Seed some books
        Book::factory(15)->create();

        $user = User::where('email', 'user@gmail.com')->first();
        if ($user) {
            $today = Carbon::today();

            for ($offset = 6; $offset >= 0; $offset--) {
                $borrowedDate = $today->copy()->subDays($offset);
                $perDay = rand(1, 3); // up to 3 borrowings per day if stock allows

                for ($i = 0; $i < $perDay; $i++) {
                    $book = Book::where('available_quantity', '>', 0)->inRandomOrder()->first();
                    if (! $book) {
                        break;
                    }

                    $days = rand(1, 7);
                    $returnDate = $borrowedDate->copy()->addDays($days);

                    $status = 'active';
                    $actualReturn = null;
                    if ($returnDate->lessThan($today)) {
                        if (rand(0, 1) === 1) {
                            $status = 'returned';
                            $actualReturn = $returnDate->copy()->addDays(rand(0, 3));
                        } else {
                            $status = 'overdue';
                        }
                    }

                    $totalCost = round($book->daily_rental_price * $days, 2);

                    Borrowing::create([
                        'user_id' => $user->id,
                        'book_id' => $book->id,
                        'borrowed_date' => $borrowedDate->toDateString(),
                        'return_date' => $returnDate->toDateString(),
                        'actual_return_date' => $actualReturn?->toDateString(),
                        'days_borrowed' => $days,
                        'total_cost' => $totalCost,
                        'status' => $status,
                    ]);

                    $book->decrement('available_quantity');
                }
            }
        }
    }
}
