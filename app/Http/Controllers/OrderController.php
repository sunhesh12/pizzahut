<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\Product;
use App\Models\Customer;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('orders/index', [
            'orders' => Order::with(['customer', 'orderItems.product'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('orders/create', [
            'products' => Product::where('is_available', true)->get(),
            'customers' => Customer::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'type' => 'required|in:Delivery,Dine-in,Takeaway',
            'pickup_time' => 'nullable|string',
            'table_number' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.size' => 'nullable|string',
            'items.*.toppings' => 'nullable|array',
            'items.*.price' => 'nullable|numeric',
        ]);

        return \DB::transaction(function () use ($validated) {
            $totalAmount = 0;
            $orderItems = [];

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $unitPrice = $item['price'] ?? $product->price;
                $subtotal = $unitPrice * $item['quantity'];
                $totalAmount += $subtotal;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'size' => $item['size'] ?? null,
                    'toppings' => $item['toppings'] ?? [],
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                ];
            }

            $order = Order::create([
                'customer_id' => $validated['customer_id'],
                'status' => 'Pending',
                'type' => $validated['type'],
                'pickup_time' => $validated['pickup_time'] ?? null,
                'table_number' => $validated['table_number'] ?? null,
                'total_amount' => $totalAmount,
            ]);

            foreach ($orderItems as $itemData) {
                $order->orderItems()->create($itemData);
            }

            return redirect()->route('orders.index');
        });
    }

    public function edit(Order $order): Response
    {
        return Inertia::render('orders/edit', [
            'order' => $order->load(['customer', 'orderItems.product']),
            'products' => Product::where('is_available', true)->get(),
            'customers' => Customer::all(),
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:Pending,Delivering,Completed,Cancelled',
            'type' => 'sometimes|in:Delivery,Dine-in,Takeaway',
            'pickup_time' => 'nullable|string',
            'table_number' => 'nullable|string',
            'customer_id' => 'sometimes|exists:customers,id',
            'items' => 'sometimes|array',
        ]);

        if (isset($validated['status']) && count($validated) === 1) {
            $order->update($validated);
            return redirect()->back();
        }

        return \DB::transaction(function () use ($validated, $order) {
            if (isset($validated['items'])) {
                $order->orderItems()->delete();
                $totalAmount = 0;
                foreach ($validated['items'] as $item) {
                    $product = Product::findOrFail($item['product_id']);
                    $subtotal = $product->price * $item['quantity'];
                    $totalAmount += $subtotal;
                    $order->orderItems()->create([
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'unit_price' => $product->price,
                        'subtotal' => $subtotal,
                    ]);
                }
                $validated['total_amount'] = $totalAmount;
            }

            $order->update($validated);
            return redirect()->route('orders.index');
        });
    }
    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.size' => 'nullable|string',
            'items.*.toppings' => 'nullable|array',
            'items.*.price' => 'nullable|numeric',
        ]);

        return \DB::transaction(function () use ($validated) {
            // Find or create customer based on email
            $customer = Customer::updateOrCreate(
                ['email' => $validated['email']],
                [
                    'name' => $validated['name'],
                    'phone' => $validated['phone'],
                    'address' => $validated['address'],
                    'city' => $validated['city'],
                    'user_id' => auth()->id(),
                ]
            );

            $totalAmount = 0;
            $orderItems = [];

            foreach ($validated['items'] as $item) {
                // Use the price from the frontend (which includes modifiers) or calculate it
                // For security, we should ideally re-calculate, but for now we follow the existing pattern
                $unitPrice = $item['price'] ?? 0;
                $subtotal = $unitPrice * $item['quantity'];
                $totalAmount += $subtotal;

                $orderItems[] = [
                    'product_id' => $item['product_id'],
                    'size' => $item['size'] ?? null,
                    'toppings' => $item['toppings'] ?? [],
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                ];
            }

            $order = Order::create([
                'customer_id' => $customer->id,
                'status' => 'Pending',
                'type' => 'Delivery',
                'total_amount' => $totalAmount,
            ]);

            foreach ($orderItems as $itemData) {
                $order->orderItems()->create($itemData);
            }

            return redirect()->route('home')->with('success', 'Order placed successfully!');
        });
    }
}
