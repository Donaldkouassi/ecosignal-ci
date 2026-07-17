<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Canaux de diffusion
|--------------------------------------------------------------------------
|
| Enregistrez ici les canaux de diffusion d’événements pris en charge par
| l’application. Les fonctions d’autorisation vérifient qu’un utilisateur
| authentifié peut écouter le canal demandé.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
