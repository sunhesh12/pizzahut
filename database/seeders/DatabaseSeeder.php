<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::updateOrCreate(
            ['email' => 'admin@pizzahut.com'],
            [
                'name' => 'PizzaHut Admin',
                'password' => Hash::make('password'),
                'role' => 'Admin'
            ]
        );

        User::updateOrCreate(
            ['email' => 'manager@pizzahut.com'],
            [
                'name' => 'Sarah Manager',
                'password' => Hash::make('password'),
                'role' => 'Manager'
            ]
        );

        User::updateOrCreate(
            ['email' => 'chef@pizzahut.com'],
            [
                'name' => 'Chef Mario',
                'password' => Hash::make('password'),
                'role' => 'Chef'
            ]
        );

        User::updateOrCreate(
            ['email' => 'reception@pizzahut.com'],
            [
                'name' => 'Front Desk Linda',
                'password' => Hash::make('password'),
                'role' => 'Receptionist'
            ]
        );

        // Seed Products
        $products = [
            [
                'name' => 'Pepperoni Feast', 
                'price' => 18.99, 
                'description' => 'Classic pepperoni with extra mozzarella cheese.', 
                'ingredients' => 'Tomato Sauce, Mozzarella, Double Pepperoni, Italian Herbs',
                'category' => 'Pizza', 
                'is_available' => true
            ],
            [
                'name' => 'Veggie Lover', 
                'price' => 16.50, 
                'description' => 'Fresh mushrooms, green peppers, onions, tomatoes, and black olives.', 
                'ingredients' => 'Tomato Sauce, Mozzarella, Mushrooms, Green Peppers, Red Onions, Fresh Tomatoes, Black Olives',
                'category' => 'Pizza', 
                'is_available' => true
            ],
            [
                'name' => 'Meat Lover', 
                'price' => 21.00, 
                'description' => 'Pepperoni, Italian sausage, ham, bacon, and seasoned pork.', 
                'ingredients' => 'Tomato Sauce, Mozzarella, Pepperoni, Italian Sausage, Sliced Ham, Crispy Bacon, Seasoned Pork',
                'category' => 'Pizza', 
                'is_available' => true
            ],
            [
                'name' => 'Hawaiian', 
                'price' => 17.50, 
                'description' => 'Sweet pineapple and savory ham with premium cheese.', 
                'ingredients' => 'Tomato Sauce, Mozzarella, Sliced Ham, Sweet Pineapple Chunks',
                'category' => 'Pizza', 
                'is_available' => true
            ],
        ];

        foreach ($products as $p) {
            \App\Models\Product::firstOrCreate(['name' => $p['name']], $p);
        }

        // Seed Customers
        $customers = [
            ['name' => 'Heshan Bandaranayake', 'email' => 'heshan@example.com', 'phone' => '0771234567', 'address' => '123 Pizza Street', 'city' => 'Colombo'],
            ['name' => 'Jane Cooper', 'email' => 'jane@example.com', 'phone' => '0719876543', 'address' => '456 Crust Road', 'city' => 'Kandy'],
        ];

        foreach ($customers as $c) {
            \App\Models\Customer::firstOrCreate(['email' => $c['email']], $c);
        }
        // Seed Sizes
        \App\Models\PizzaSize::insert([
            ['name' => 'Personal', 'price_modifier' => 0.00, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Medium', 'price_modifier' => 4.00, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Large', 'price_modifier' => 8.00, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Seed Toppings
        \App\Models\Topping::insert([
            ['name' => 'Extra Cheese', 'price' => 2.00, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Mushrooms', 'price' => 1.50, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Onions', 'price' => 1.00, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Green Peppers', 'price' => 1.00, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Black Olives', 'price' => 1.50, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Pepperoni', 'price' => 2.50, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
