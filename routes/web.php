<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'products' => \App\Models\Product::where('is_available', true)
            ->where('category', 'Pizza')
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get(),
        'pizzaSizes' => \App\Models\PizzaSize::where('is_available', true)->get(),
        'toppings' => \App\Models\Topping::where('is_available', true)->get(),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Admin, Manager, and Chef can manage products
    Route::middleware(['role:Admin,Manager,Chef'])->group(function () {
        Route::resource('products', App\Http\Controllers\ProductController::class);
        Route::resource('pizza-sizes', App\Http\Controllers\PizzaSizeController::class);
        Route::resource('toppings', App\Http\Controllers\ToppingController::class);
    });

    // Admin, Manager, and Receptionist can manage customers
    Route::middleware(['role:Admin,Manager,Receptionist'])->group(function () {
        Route::resource('customers', App\Http\Controllers\CustomerController::class);
    });

    // Admin and Manager can manage staff
    Route::middleware(['role:Admin,Manager'])->group(function () {
        Route::resource('staff', App\Http\Controllers\StaffController::class);
    });
    
    // All staff can handle orders
    Route::get('orders', [App\Http\Controllers\OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/create', [App\Http\Controllers\OrderController::class, 'create'])->name('orders.create');
    Route::get('orders/{order}/edit', [App\Http\Controllers\OrderController::class, 'edit'])->name('orders.edit');
    Route::post('orders', [App\Http\Controllers\OrderController::class, 'store'])->name('orders.store');
    Route::patch('orders/{order}', [App\Http\Controllers\OrderController::class, 'update'])->name('orders.update');

    Route::get('checkout', function () {
        return Inertia::render('checkout');
    })->name('checkout');
    Route::post('checkout', [App\Http\Controllers\OrderController::class, 'checkout'])->name('checkout.store');
});
require __DIR__.'/settings.php';
