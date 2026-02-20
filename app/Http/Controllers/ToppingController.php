<?php

namespace App\Http\Controllers;

use App\Models\Topping;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ToppingController extends Controller
{
    public function index()
    {
        return Inertia::render('products/toppings/index', [
            'toppings' => Topping::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'is_available' => 'required|boolean',
        ]);

        Topping::create($validated);

        return redirect()->back()->with('success', 'Topping created successfully!');
    }

    public function update(Request $request, Topping $topping)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'is_available' => 'required|boolean',
        ]);

        $topping->update($validated);

        return redirect()->back()->with('success', 'Topping updated successfully!');
    }

    public function destroy(Topping $topping)
    {
        $topping->delete();

        return redirect()->back()->with('success', 'Topping deleted successfully!');
    }
}
