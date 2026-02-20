<?php

namespace App\Http\Controllers;

use App\Models\PizzaSize;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PizzaSizeController extends Controller
{
    public function index()
    {
        return Inertia::render('products/sizes/index', [
            'sizes' => PizzaSize::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price_modifier' => 'required|numeric|min:0',
            'is_available' => 'required|boolean',
        ]);

        PizzaSize::create($validated);

        return redirect()->back()->with('success', 'Size created successfully!');
    }

    public function update(Request $request, PizzaSize $pizzaSize)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price_modifier' => 'required|numeric|min:0',
            'is_available' => 'required|boolean',
        ]);

        $pizzaSize->update($validated);

        return redirect()->back()->with('success', 'Size updated successfully!');
    }

    public function destroy(PizzaSize $pizzaSize)
    {
        $pizzaSize->delete();

        return redirect()->back()->with('success', 'Size deleted successfully!');
    }
}
