<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsMerchant
{
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::user()->type !== 'merchant') {
            return response()->json(['message' => 'Acesso permitido apenas para comerciantes'], 403);
        }

        return $next($request);
    }
}
