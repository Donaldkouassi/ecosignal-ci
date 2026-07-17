<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes web
|--------------------------------------------------------------------------
|
| Enregistrez ici les routes web de l’application. Elles sont chargées par
| RouteServiceProvider et associées au groupe de middlewares « web ».
|
*/

Route::get('/', function () {
    return response()->json([
        'application' => 'EcoSignal CI API',
        'status' => 'online',
        'message' => 'Le backend fonctionne correctement.',
    ]);
});
