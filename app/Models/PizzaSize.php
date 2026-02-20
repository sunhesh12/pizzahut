<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PizzaSize extends Model
{
    protected $fillable = [
        'name',
        'price_modifier',
        'is_available',
    ];

    protected $casts = [
        'price_modifier' => 'decimal:2',
        'is_available' => 'boolean',
    ];
}
