<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CollecteController;
use App\Http\Controllers\Api\ConseilController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\SignalementController;
use App\Http\Controllers\Api\StatistiqueController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:register');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

Route::get('/conseils', [ConseilController::class, 'index']);
Route::get('/statistiques', [StatistiqueController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/signalements', [SignalementController::class, 'index']);
    Route::get('/signalements/{signalement}', [SignalementController::class, 'show']);
    Route::post('/signalements', [SignalementController::class, 'store'])->middleware('throttle:uploads');

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/non-lues', [NotificationController::class, 'unreadCount']);
    Route::patch('/notifications/{notification}/lue', [NotificationController::class, 'markAsRead']);

    Route::middleware('admin')->group(function () {
        Route::patch('/signalements/{signalement}/statut', [SignalementController::class, 'updateStatut']);
        Route::delete('/signalements/{signalement}', [SignalementController::class, 'destroy']);

        Route::post('/conseils', [ConseilController::class, 'store']);

        Route::get('/collectes', [CollecteController::class, 'index']);
        Route::post('/collectes', [CollecteController::class, 'store']);
        Route::patch('/collectes/{collecte}', [CollecteController::class, 'update']);
        Route::delete('/collectes/{collecte}', [CollecteController::class, 'destroy']);
    });
});
