<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

/*
|--------------------------------------------------------------------------
| Routes de la console
|--------------------------------------------------------------------------
|
| Ce fichier permet de définir les commandes console basées sur des closures.
| Chaque closure est associée à une instance de commande, ce qui simplifie
| l’utilisation des méthodes d’entrée et de sortie.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
