<?php

use Illuminate\Support\Facades\Facade;
use Illuminate\Support\ServiceProvider;

return [

    /*
    |--------------------------------------------------------------------------
    | Nom de l’application
    |--------------------------------------------------------------------------
    |
    | Cette valeur correspond au nom de votre application. Elle est utilisée
    | lorsque le framework doit afficher ce nom dans une notification ou
    | dans tout autre emplacement requis par l’application ou ses paquets.
    |
    */

    'name' => env('APP_NAME', 'Laravel'),

    /*
    |--------------------------------------------------------------------------
    | Environnement de l’application
    |--------------------------------------------------------------------------
    |
    | Cette valeur détermine l’environnement dans lequel l’application
    | s’exécute. Elle peut influencer la configuration des différents services.
    | Définissez-la dans le fichier « .env ».
    |
    */

    'env' => env('APP_ENV', 'production'),

    /*
    |--------------------------------------------------------------------------
    | Mode de débogage de l’application
    |--------------------------------------------------------------------------
    |
    | Lorsque le mode débogage est activé, des messages détaillés accompagnés
    | de leur trace sont affichés pour chaque erreur. Lorsqu’il est désactivé,
    | une page d’erreur générique est présentée.
    |
    */

    'debug' => (bool) env('APP_DEBUG', false),

    /*
    |--------------------------------------------------------------------------
    | URL de l’application
    |--------------------------------------------------------------------------
    |
    | Cette URL est utilisée par la console pour générer correctement les URL
    | avec l’outil Artisan. Elle doit correspondre à la racine de l’application
    | afin d’être utilisée pendant l’exécution des tâches Artisan.
    |
    */

    'url' => env('APP_URL', 'http://localhost'),

    'asset_url' => env('ASSET_URL'),

    /*
    |--------------------------------------------------------------------------
    | Fuseau horaire de l’application
    |--------------------------------------------------------------------------
    |
    | Vous pouvez préciser ici le fuseau horaire par défaut de l’application.
    | Il sera utilisé par les fonctions PHP de gestion des dates et heures.
    | Une valeur par défaut raisonnable est fournie.
    |
    */

    'timezone' => 'UTC',

    /*
    |--------------------------------------------------------------------------
    | Configuration de la langue de l’application
    |--------------------------------------------------------------------------
    |
    | La langue de l’application détermine celle utilisée par défaut par
    | le service de traduction. Vous pouvez choisir toute langue prise
    | en charge par l’application.
    |
    */

    'locale' => 'en',

    /*
    |--------------------------------------------------------------------------
    | Langue de secours de l’application
    |--------------------------------------------------------------------------
    |
    | La langue de secours est utilisée lorsque la langue actuelle n’est pas
    | disponible. Vous pouvez choisir une valeur correspondant à l’un des
    | dossiers de langue fournis avec l’application.
    |
    */

    'fallback_locale' => 'en',

    /*
    |--------------------------------------------------------------------------
    | Langue de Faker
    |--------------------------------------------------------------------------
    |
    | Cette langue est utilisée par la bibliothèque Faker pour générer les
    | données fictives des seeders, comme les numéros de téléphone, les
    | adresses et d’autres informations localisées.
    |
    */

    'faker_locale' => 'en_US',

    /*
    |--------------------------------------------------------------------------
    | Clé de chiffrement
    |--------------------------------------------------------------------------
    |
    | Cette clé est utilisée par le service de chiffrement Illuminate et doit
    | contenir une valeur aléatoire sécurisée. Sans elle, les données chiffrées
    | ne seront pas protégées. Configurez-la avant tout déploiement.
    |
    */

    'key' => env('APP_KEY'),

    'cipher' => 'AES-256-CBC',

    /*
    |--------------------------------------------------------------------------
    | Pilote du mode maintenance
    |--------------------------------------------------------------------------
    |
    | Ces options déterminent le pilote utilisé pour gérer le mode maintenance
    | de Laravel. Le pilote « cache » permet de piloter ce mode sur plusieurs
    | machines.
    |
    | Pilotes pris en charge : « file », « cache »
    |
    */

    'maintenance' => [
        'driver' => 'file',
        // 'store' => 'redis',
    ],

    /*
    |--------------------------------------------------------------------------
    | Fournisseurs de services chargés automatiquement
    |--------------------------------------------------------------------------
    |
    | Les fournisseurs de services listés ici sont chargés automatiquement
    | à chaque requête. Vous pouvez ajouter vos propres services à ce tableau
    | afin d’étendre les fonctionnalités de l’application.
    |
    */

    'providers' => ServiceProvider::defaultProviders()->merge([
        /*
         * Fournisseurs de services des paquets...
         */

        /*
         * Fournisseurs de services de l’application...
         */
        App\Providers\AppServiceProvider::class,
        App\Providers\AuthServiceProvider::class,
        // App\Providers\BroadcastServiceProvider::class,
        App\Providers\EventServiceProvider::class,
        App\Providers\RouteServiceProvider::class,
    ])->toArray(),

    /*
    |--------------------------------------------------------------------------
    | Alias de classes
    |--------------------------------------------------------------------------
    |
    | Ce tableau d’alias de classes est enregistré au démarrage de
    | l’application. Vous pouvez en ajouter autant que nécessaire : les alias
    | sont chargés à la demande afin de ne pas réduire les performances.
    |
    */

    'aliases' => Facade::defaultAliases()->merge([
        // 'Example' => App\Facades\Example::class,
    ])->toArray(),

];
