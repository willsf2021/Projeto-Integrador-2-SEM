<?php


namespace App\Http\Controllers\Api\Merchant;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{

    public function index()
    {
        $orders = Order::where('merchant_id', Auth::id())
            ->with(['client', 'attachments'])
            ->latest()
            ->get();

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:users,id',
            'service' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'due_date' => 'nullable|date',
        ]);

        $order = Order::create([
            'merchant_id' => Auth::id(),
            'client_id' => $validated['client_id'],
            'service' => $validated['service'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'due_date' => $validated['due_date'] ?? null,
            'status' => 'pending',
            'payment_status' => 'pending_payment',
        ]);

        return response()->json($order, 201);
    }

    public function show(Order $order)
    {
        // Verifica se a ordem pertence ao merchant
        if ($order->merchant_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order->load(['client', 'attachments']);

        return response()->json($order);
    }

    public function update(Request $request, Order $order)
    {

        if ($order->merchant_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'service' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:pending,in_progress,completed,cancelled',
            'payment_status' => 'sometimes|in:paid,pending_payment,overdue,cancelled',
            'due_date' => 'nullable|date',
        ]);

        $order->update($validated);

        return response()->json($order);
    }

    public function destroy(Order $order)
    {

        if ($order->merchant_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order->delete();

        return response()->json(null, 204);
    }
}
