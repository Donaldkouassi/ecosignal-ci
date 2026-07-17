<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Nom de la connexion de file d’attente par défaut
    |--------------------------------------------------------------------------
    |
    | L’API de files d’attente Laravel prend en charge plusieurs systèmes
    | avec une interface unique et une syntaxe commune. Vous pouvez définir
    | ici la connexion utilisée par défaut.
    |
    */

    'default' => env('QUEUE_CONNECTION', 'sync'),

    /*
    |--------------------------------------------------------------------------
    | Connexions aux files d’attente
    |--------------------------------------------------------------------------
    |
    | Configurez ici les informations de connexion de chaque serveur utilisé
    | par l’application. Une configuration par défaut est fournie pour chaque
    | système inclus avec Laravel et d’autres peuvent être ajoutées.
    |
    | Pilotes : « sync », « database », « beanstalkd », « sqs », « redis », « null »
    |
    */

    'connections' => [

        'sync' => [
            'driver' => 'sync',
        ],

        'database' => [
            'driver' => 'database',
            'table' => 'jobs',
            'queue' => 'default',
            'retry_after' => 90,
            'after_commit' => false,
        ],

        'beanstalkd' => [
            'driver' => 'beanstalkd',
            'host' => 'localhost',
            'queue' => 'default',
            'retry_after' => 90,
            'block_for' => 0,
            'after_commit' => false,
        ],

        'sqs' => [
            'driver' => 'sqs',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'prefix' => env('SQS_PREFIX', 'https://sqs.us-east-1.amazonaws.com/your-account-id'),
            'queue' => env('SQS_QUEUE', 'default'),
            'suffix' => env('SQS_SUFFIX'),
            'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
            'after_commit' => false,
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => 'default',
            'queue' => env('REDIS_QUEUE', 'default'),
            'retry_after' => 90,
            'block_for' => null,
            'after_commit' => false,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Traitement des tâches par lots
    |--------------------------------------------------------------------------
    |
    | Les options suivantes configurent la base et la table qui stockent les
    | informations des lots de tâches. Elles peuvent cibler toute connexion
    | et toute table définies dans l’application.
    |
    */

    'batching' => [
        'database' => env('DB_CONNECTION', 'mysql'),
        'table' => 'job_batches',
    ],

    /*
    |--------------------------------------------------------------------------
    | Tâches de file d’attente échouées
    |--------------------------------------------------------------------------
    |
    | Ces options configurent la journalisation des tâches échouées et
    | déterminent la base et la table utilisées pour les conserver.
    |
    */

    'failed' => [
        'driver' => env('QUEUE_FAILED_DRIVER', 'database-uuids'),
        'database' => env('DB_CONNECTION', 'mysql'),
        'table' => 'failed_jobs',
    ],

];
