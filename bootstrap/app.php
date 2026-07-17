<?php

/*
|--------------------------------------------------------------------------
| Création de l’application
|--------------------------------------------------------------------------
|
| Nous créons d’abord une instance de l’application Laravel. Elle relie
| l’ensemble des composants du framework et sert de conteneur d’inversion
| de contrôle pour les différentes parties du système.
|
*/

$app = new Illuminate\Foundation\Application(
    $_ENV['APP_BASE_PATH'] ?? dirname(__DIR__)
);

/*
|--------------------------------------------------------------------------
| Bind Important Interfaces
|--------------------------------------------------------------------------
|
| Nous associons ensuite plusieurs interfaces importantes au conteneur afin
| de pouvoir les résoudre au besoin. Les noyaux traitent les requêtes reçues
| par l’application depuis le web et la ligne de commande.
|
*/

$app->singleton(
    Illuminate\Contracts\Http\Kernel::class,
    App\Http\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    App\Console\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Debug\ExceptionHandler::class,
    App\Exceptions\Handler::class
);

/*
|--------------------------------------------------------------------------
| Retour de l’application
|--------------------------------------------------------------------------
|
| Ce script retourne l’instance de l’application au script appelant afin
| de séparer sa construction de son exécution et de l’envoi des réponses.
|
*/

return $app;
