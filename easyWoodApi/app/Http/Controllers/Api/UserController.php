<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('id', 'DESC')->get();
        return response()->json([
            'status' => true,
            'users' => $users
        ], 200);
    }

    public function listClients()
    {
        $clients = User::where('type', 'client') // ou outro filtro que preferir
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $clients
        ]);
    }
}
