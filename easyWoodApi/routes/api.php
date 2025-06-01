<?php

use App\Http\Controllers\Api\Client\ClientOrderController;
use App\Http\Controllers\Api\Merchant\OrderController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::prefix('client')->group(function () {
        Route::get('/orders', [ClientOrderController::class, 'index']);
        Route::get('/orders/history', [ClientOrderController::class, 'history']);
        Route::get('/orders/{order}', [ClientOrderController::class, 'show']);
    });

    Route::middleware('merchant')->group(function () {
        Route::apiResource('orders', \App\Http\Controllers\Api\Merchant\OrderController::class);
    });
});
