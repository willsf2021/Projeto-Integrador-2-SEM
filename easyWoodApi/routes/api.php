<?php

use App\Http\Controllers\Api\Client\ClientOrderController;
use App\Http\Controllers\Api\Merchant\LowStockAlertController;
use App\Http\Controllers\Api\Merchant\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\Merchant\OrderAttachmentController;
use App\Http\Controllers\Api\UserController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::middleware('client')->prefix('client')->group(function () {
        Route::get('/orders', [ClientOrderController::class, 'index']);
        Route::get('/orders/history', [ClientOrderController::class, 'history']);
        Route::get('/orders/{order}', [ClientOrderController::class, 'show']);
        Route::get(
            '/orders/{order}/attachments/{attachment}/download',
            [ClientOrderController::class, 'downloadAttachment']
        );
    });

    Route::middleware('merchant')->group(function () {
        Route::apiResource('orders', OrderController::class);
        Route::middleware('merchant')->get('/users', [UserController::class, 'listClients']);

        Route::apiResource('materials', \App\Http\Controllers\Api\Merchant\MaterialController::class);
        Route::get('/low-stock-alerts', [LowStockAlertController::class, 'index']);

        Route::prefix('materials/{material}')->group(function () {
            Route::post('/add-stock', [\App\Http\Controllers\Api\Merchant\MaterialController::class, 'addStock']);
            Route::post('/reduce-stock', [\App\Http\Controllers\Api\Merchant\MaterialController::class, 'reduceStock']);
        });

        Route::prefix('orders/{order}')->group(function () {

            Route::get(
                'attachments/{attachment}/download',
                [OrderAttachmentController::class, 'download']
            )
                ->name('orders.attachments.download');

            Route::apiResource('attachments', OrderAttachmentController::class)
                ->only(['index', 'store', 'destroy'])
                ->scoped(['attachment' => 'id'])
                ->names([
                    'index' => 'orders.attachments.index',
                    'store' => 'orders.attachments.store',
                    'destroy' => 'orders.attachments.destroy',
                ]);
        });
    });
});
