<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClientOrderController extends Controller
{

    public function index()
    {
        $orders = Order::where('client_id', Auth::id())
            ->whereNotIn('status', ['completed', 'cancelled'])
            ->with('attachments')
            ->latest()
            ->get();

        return response()->json($orders);
    }

    public function history()
    {
        $orders = Order::where('client_id', Auth::id())
            ->whereIn('status', ['completed', 'cancelled'])
            ->with('attachments')
            ->latest()
            ->get();

        return response()->json($orders);
    }

    public function show(Order $order)
    {
        if ($order->client_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order->load('attachments');
        return response()->json($order);
    }
}
