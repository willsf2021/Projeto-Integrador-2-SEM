<?php

namespace App\Http\Controllers\Api\Merchant;

use App\Http\Controllers\Controller;
use App\Models\LowStockAlert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LowStockAlertController extends Controller
{
    // Listar todos os alertas do merchant logado
    public function index()
    {
        $alerts = LowStockAlert::with('material')
            ->whereHas('material', function ($query) {
                $query->where('merchant_id', Auth::id());
            })
            ->orderBy('triggered_at', 'desc')
            ->get();

        return response()->json($alerts);
    }

    // Marcar um alerta como resolvido
    public function resolve($id)
    {
        $alert = LowStockAlert::findOrFail($id);

        if ($alert->material->merchant_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $alert->resolved = true;
        $alert->save();

        return response()->json(['message' => 'Alerta resolvido com sucesso']);
    }

    // Deletar alerta (opcional)
    public function destroy($id)
    {
        $alert = LowStockAlert::findOrFail($id);

        if ($alert->material->merchant_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $alert->delete();

        return response()->noContent();
    }
}
