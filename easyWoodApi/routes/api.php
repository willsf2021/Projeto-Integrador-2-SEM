<?php

use App\Http\Controllers\Api\Merchant\OrderController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/users', [UserController::class, 'index']);

Route::middleware(['auth:sanctum', 'merchant'])->group(function () {
    Route::apiResource('orders', OrderController::class);
});


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::middleware('merchant')->group(function () {
        Route::apiResource('orders', \App\Http\Controllers\Api\Merchant\OrderController::class);
    });
});
