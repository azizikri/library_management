<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'isbn',
        'category',
        'daily_rental_price',
        'stock_quantity',
        'available_quantity',
        'description',
    ];

    public function borrowings(): HasMany
    {
        return $this->hasMany(Borrowing::class);
    }
}

