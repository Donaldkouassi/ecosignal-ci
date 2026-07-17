<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Diffuseur par défaut
    |--------------------------------------------------------------------------
    |
    | Cette option définit le diffuseur utilisé par défaut lorsqu’un événement
    | doit être transmis. Toute connexion définie ci-dessous peut être choisie.
    |
    | Pris en charge : « pusher », « ably », « redis », « log », « null »
    |
    */

    'default' => env('BROADCAST_DRIVER', 'null'),

    /*
    |--------------------------------------------------------------------------
    | Connexions de diffusion
    |--------------------------------------------------------------------------
    |
    | Définissez ici les connexions utilisées pour transmettre les événements
    | vers d’autres systèmes ou par WebSocket. Des exemples sont fournis.
    |
    */

    'connections' => [

        'pusher' => [
            'driver' => 'pusher',
            'key' => env('PUSHER_APP_KEY'),
            'secret' => env('PUSHER_APP_SECRET'),
            'app_id' => env('PUSHER_APP_ID'),
            'options' => [
                'cluster' => env('PUSHER_APP_CLUSTER'),
                'host' => env('PUSHER_HOST') ?: 'api-'.env('PUSHER_APP_CLUSTER', 'mt1').'.pusher.com',
                'port' => env('PUSHER_PORT', 443),
                'scheme' => env('PUSHER_SCHEME', 'https'),
                'encrypted' => true,
                'useTLS' => env('PUSHER_SCHEME', 'https') === 'https',
            ],
            'client_options' => [
                // Options du client Guzzle : https://docs.guzzlephp.org/en/stable/request-options.html
            ],
        ],

        'ably' => [
            'driver' => 'ably',
            'key' => env('ABLY_KEY'),
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => 'default',
        ],

        'log' => [
            'driver' => 'log',
        ],

        'null' => [
            'driver' => 'null',
        ],

    ],

];
