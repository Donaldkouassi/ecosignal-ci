<?php

use Illuminate\Support\Str;

return [

    /*
    |--------------------------------------------------------------------------
    | Pilote de session par défaut
    |--------------------------------------------------------------------------
    |
    | Cette option définit le pilote de session utilisé pour les requêtes.
    | Le pilote natif léger est utilisé par défaut, mais un autre peut être choisi.
    |
    | Pris en charge : "file", "cookie", "database", "apc",
    |            "memcached", "redis", "dynamodb", "array"
    |
    */

    'driver' => env('SESSION_DRIVER', 'file'),

    /*
    |--------------------------------------------------------------------------
    | Durée de vie de la session
    |--------------------------------------------------------------------------
    |
    | Indiquez le nombre de minutes d’inactivité avant l’expiration de la
    | session. Une autre option permet de l’expirer à la fermeture du navigateur.
    |
    */

    'lifetime' => env('SESSION_LIFETIME', 120),

    'expire_on_close' => false,

    /*
    |--------------------------------------------------------------------------
    | Chiffrement des sessions
    |--------------------------------------------------------------------------
    |
    | Cette option permet de chiffrer toutes les données avant leur stockage.
    | Laravel effectue automatiquement le chiffrement.
    |
    */

    'encrypt' => false,

    /*
    |--------------------------------------------------------------------------
    | Emplacement des fichiers de session
    |--------------------------------------------------------------------------
    |
    | Le pilote natif nécessite un emplacement pour les fichiers de session.
    | Une valeur par défaut est fournie et peut être remplacée.
    |
    */

    'files' => storage_path('framework/sessions'),

    /*
    |--------------------------------------------------------------------------
    | Connexion à la base des sessions
    |--------------------------------------------------------------------------
    |
    | Avec les pilotes « database » ou « redis », indiquez la connexion utilisée
    | pour gérer les sessions. Elle doit exister dans la configuration des bases.
    |
    */

    'connection' => env('SESSION_CONNECTION'),

    /*
    |--------------------------------------------------------------------------
    | Table des sessions
    |--------------------------------------------------------------------------
    |
    | Avec le pilote « database », indiquez la table utilisée pour gérer
    | les sessions. Une valeur par défaut est fournie.
    |
    */

    'table' => 'sessions',

    /*
    |--------------------------------------------------------------------------
    | Stockage de cache des sessions
    |--------------------------------------------------------------------------
    |
    | Avec un pilote de session basé sur le cache, indiquez un stockage
    | configuré dans l’application.
    |
    | Concerne : « apc », « dynamodb », « memcached », « redis »
    |
    */

    'store' => env('SESSION_STORE'),

    /*
    |--------------------------------------------------------------------------
    | Loterie de nettoyage des sessions
    |--------------------------------------------------------------------------
    |
    | Certains pilotes doivent supprimer manuellement les anciennes sessions.
    | Ces valeurs définissent la probabilité d’un nettoyage à chaque requête.
    |
    */

    'lottery' => [2, 100],

    /*
    |--------------------------------------------------------------------------
    | Nom du cookie de session
    |--------------------------------------------------------------------------
    |
    | Modifiez ici le nom du cookie qui identifie une session. Il sera utilisé
    | chaque fois que le framework crée un nouveau cookie de session.
    |
    */

    'cookie' => env(
        'SESSION_COOKIE',
        Str::slug(env('APP_NAME', 'laravel'), '_').'_session'
    ),

    /*
    |--------------------------------------------------------------------------
    | Chemin du cookie de session
    |--------------------------------------------------------------------------
    |
    | Ce chemin détermine où le cookie est disponible. Il correspond
    | généralement à la racine de l’application.
    |
    */

    'path' => '/',

    /*
    |--------------------------------------------------------------------------
    | Domaine du cookie de session
    |--------------------------------------------------------------------------
    |
    | Ce domaine détermine sur quels domaines le cookie de session est disponible.
    |
    */

    'domain' => env('SESSION_DOMAIN'),

    /*
    |--------------------------------------------------------------------------
    | Cookies réservés à HTTPS
    |--------------------------------------------------------------------------
    |
    | Si cette option est activée, les cookies de session sont envoyés au
    | serveur uniquement par une connexion HTTPS.
    |
    */

    'secure' => env('SESSION_SECURE_COOKIE'),

    /*
    |--------------------------------------------------------------------------
    | Accès HTTP uniquement
    |--------------------------------------------------------------------------
    |
    | Cette option empêche JavaScript d’accéder au cookie, qui reste
    | uniquement accessible par le protocole HTTP.
    |
    */

    'http_only' => true,

    /*
    |--------------------------------------------------------------------------
    | Cookies SameSite
    |--------------------------------------------------------------------------
    |
    | Cette option définit le comportement des cookies lors des requêtes
    | intersites et contribue à limiter les attaques CSRF.
    |
    | Pris en charge : « lax », « strict », « none », null
    |
    */

    'same_site' => 'lax',

    /*
    |--------------------------------------------------------------------------
    | Cookies partitionnés
    |--------------------------------------------------------------------------
    |
    | Cette option lie le cookie au site principal dans un contexte intersite.
    | Les cookies partitionnés nécessitent « secure » et SameSite à « none ».
    |
    */

    'partitioned' => false,

];
