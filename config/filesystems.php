<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Disque de stockage par défaut
    |--------------------------------------------------------------------------
    |
    | Indiquez ici le disque de stockage utilisé par défaut par le framework.
    | L’application peut utiliser le disque local ou différents services
    | de stockage dans le nuage.
    |
    */

    'default' => env('FILESYSTEM_DISK', 'local'),

    /*
    |--------------------------------------------------------------------------
    | Disques de stockage
    |--------------------------------------------------------------------------
    |
    | Configurez ici autant de disques que nécessaire, y compris plusieurs
    | disques utilisant le même pilote. Des valeurs d’exemple sont fournies
    | pour chaque pilote.
    |
    | Pilotes pris en charge : « local », « ftp », « sftp », « s3 »
    |
    */

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app'),
            'throw' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL').'/storage',
            'visibility' => 'public',
            'throw' => false,
        ],

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Liens symboliques
    |--------------------------------------------------------------------------
    |
    | Configurez ici les liens symboliques créés par la commande Artisan
    | `storage:link`. Les clés correspondent aux emplacements des liens
    | et les valeurs à leurs cibles.
    |
    */

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
