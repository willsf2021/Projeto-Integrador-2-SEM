<?php

namespace App\Http\Controllers\Api\Merchant;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class OrderAttachmentController extends Controller
{
    public function index(Order $order)
    {

        if ($order->merchant_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($order->attachments);
    }

    public function store(Request $request, Order $order)
    {
        if ($order->merchant_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:10240|mimes:jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $file = $request->file('file');
        $path = $file->store("attachments/order_{$order->id}");

        $attachment = $order->attachments()->create([
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);

        return response()->json($attachment, 201);
    }

    public function download(Order $order, OrderAttachment $attachment)
    {
        if ($attachment->order_id !== $order->id) {
            abort(404);
        }

        if ($order->merchant_id !== auth()->id() || $attachment->order_id !== $order->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return Storage::download($attachment->path, $attachment->original_name);
    }

    public function destroy(Order $order, OrderAttachment $attachment)
    {
        if ($attachment->order_id !== $order->id) {
            abort(404);
        }
        if ($order->merchant_id !== auth()->id() || $attachment->order_id !== $order->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        Storage::delete($attachment->path);

        $attachment->delete();

        return response()->noContent();
    }
}
