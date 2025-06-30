<?php

namespace App\Http\Controllers\Api\Merchant;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MaterialController extends Controller
{
    // Listar todos os materiais
    public function index()
    {
        $materials = Material::where('merchant_id', Auth::id())->get();
        return response()->json($materials);
    }

    // Criar novo material (ou lista de materiais)
    public function store(Request $request)
    {
        // Verifica se é um array de materiais
        if (is_array($request->all())) {
            return $this->storeMany($request);
        }

        // Processamento para um único material
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'unit' => 'required|string|max:10',
        ]);

        $material = Material::create([
            'merchant_id' => Auth::id(),
            ...$validated
        ]);

        return response()->json($material, 201);
    }

    // Método privado para criar múltiplos materiais
    private function storeMany(Request $request)
    {
        $materials = [];
        $errors = [];

        foreach ($request->all() as $index => $item) {
            try {
                $validator = validator($item, [
                    'name' => 'required|string|max:255',
                    'description' => 'nullable|string',
                    'price' => 'required|numeric|min:0',
                    'quantity' => 'required|integer|min:0',
                    'unit' => 'required|string|max:10',
                ]);

                if ($validator->fails()) {
                    $errors[] = [
                        'index' => $index,
                        'errors' => $validator->errors(),
                        'data' => $item
                    ];
                    continue;
                }

                $materials[] = Material::create([
                    'merchant_id' => Auth::id(),
                    'name' => $item['name'],
                    'description' => $item['description'] ?? null,
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'unit' => $item['unit']
                ]);
            } catch (\Exception $e) {
                $errors[] = [
                    'index' => $index,
                    'error' => $e->getMessage(),
                    'data' => $item
                ];
            }
        }

        $response = [
            'created_count' => count($materials),
            'materials' => $materials,
        ];

        if (!empty($errors)) {
            $response['errors'] = $errors;
            return response()->json($response, 207); // 207 = Multi-Status
        }

        return response()->json($response, 201);
    }

    // Mostrar material específico
    public function show(Material $material)
    {
        if ($material->merchant_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($material);
    }

    // Atualizar material
    public function update(Request $request, Material $material)
    {
        if ($material->merchant_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'quantity' => 'sometimes|integer|min:0',
            'unit' => 'sometimes|string|max:10',
        ]);

        $material->update($validated);

        return response()->json($material);
    }

    // Excluir material
    public function destroy(Material $material)
    {
        if ($material->merchant_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $material->delete();

        return response()->noContent();
    }

    // Adicionar estoque
    public function addStock(Request $request, Material $material)
    {
        if ($material->merchant_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $material->increment('quantity', $request->quantity);

        return response()->json([
            'message' => 'Estoque adicionado com sucesso',
            'new_quantity' => $material->quantity
        ]);
    }

    // Reduzir estoque
    public function reduceStock(Request $request, Material $material)
    {
        if ($material->merchant_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        if ($material->quantity < $request->quantity) {
            return response()->json([
                'message' => 'Quantidade insuficiente em estoque'
            ], 400);
        }

        $material->decrement('quantity', $request->quantity);

        return response()->json([
            'message' => 'Estoque reduzido com sucesso',
            'new_quantity' => $material->quantity
        ]);
    }
}
