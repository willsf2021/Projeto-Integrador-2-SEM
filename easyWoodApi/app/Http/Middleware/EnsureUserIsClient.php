<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsClient
{
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::user()->type !== 'client') {
            return response()->json(['message' => 'Acesso permitido apenas para clientes'], 403);
        }

        return $next($request);
    }
}
