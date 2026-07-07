<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SignalementController;
use App\Http\Controllers\Api\ConseilController;
use App\Http\Controllers\Api\StatistiqueController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/signalements', [SignalementController::class, 'index']);
Route::post('/signalements', [SignalementController::class, 'store']);
Route::patch('/signalements/{signalement}/statut', [SignalementController::class, 'updateStatut']);
Route::delete('/signalements/{signalement}', [SignalementController::class, 'destroy']);

Route::get('/conseils', [ConseilController::class, 'index']);
Route::post('/conseils', [ConseilController::class, 'store']);

Route::get('/statistiques', [StatistiqueController::class, 'index']);
