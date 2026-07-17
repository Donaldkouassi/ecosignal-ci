<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Configuration du partage de ressources entre origines (CORS)
    |--------------------------------------------------------------------------
    |
    | Configurez ici le partage de ressources entre origines, ou « CORS ».
    | Ces réglages déterminent les opérations interorigines autorisées dans
    | les navigateurs web et peuvent être adaptés selon vos besoins.
    |
    | En savoir plus : https://developer.mozilla.org/fr/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'),
        'http://127.0.0.1:3000',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
