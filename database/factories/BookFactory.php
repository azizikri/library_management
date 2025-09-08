<?php

namespace Database\Factories;

use App\Models\Book;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Book>
 */
class BookFactory extends Factory
{
    protected $model = Book::class;

    public function definition(): array
    {
        $stock = fake()->numberBetween(1, 20);
        $available = fake()->numberBetween(0, $stock);
        return [
            'title' => fake()->sentence(3),
            'author' => fake()->name(),
            'isbn' => fake()->unique()->isbn13(),
            'category' => fake()->randomElement(['Fiction', 'Non-fiction', 'Science', 'History', 'Technology']),
            'daily_rental_price' => fake()->randomFloat(2, 1000, 10000),
            'stock_quantity' => $stock,
            'available_quantity' => $available,
            'description' => fake()->paragraph(),
        ];
    }
}
