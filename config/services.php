<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Services tiers
    |--------------------------------------------------------------------------
    |
    | Ce fichier contient la configuration des services tiers comme Mailgun,
    | Postmark ou AWS. Il fournit un emplacement conventionnel permettant
    | aux paquets de retrouver les identifiants de ces différents services.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

];
