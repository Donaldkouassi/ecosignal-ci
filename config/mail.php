<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Service d’envoi par défaut
    |--------------------------------------------------------------------------
    |
    | Cette option définit le service utilisé par défaut pour envoyer les
    | courriels. D’autres services peuvent être configurés selon les besoins.
    |
    */

    'default' => env('MAIL_MAILER', 'smtp'),

    /*
    |--------------------------------------------------------------------------
    | Configuration des services d’envoi
    |--------------------------------------------------------------------------
    |
    | Configurez ici les services d’envoi de l’application et leurs réglages.
    | Plusieurs exemples sont fournis et d’autres peuvent être ajoutés.
    |
    | Laravel prend en charge plusieurs pilotes de transport. Indiquez
    | ci-dessous le pilote utilisé par chaque service d’envoi.
    |
    | Pris en charge : "smtp", "sendmail", "mailgun", "ses", "ses-v2",
    |            "postmark", "log", "array", "failover", "roundrobin"
    |
    */

    'mailers' => [
        'smtp' => [
            'transport' => 'smtp',
            'url' => env('MAIL_URL'),
            'host' => env('MAIL_HOST', 'smtp.mailgun.org'),
            'port' => env('MAIL_PORT', 587),
            'encryption' => env('MAIL_ENCRYPTION', 'tls'),
            'username' => env('MAIL_USERNAME'),
            'password' => env('MAIL_PASSWORD'),
            'timeout' => null,
            'local_domain' => env('MAIL_EHLO_DOMAIN'),
        ],

        'ses' => [
            'transport' => 'ses',
        ],

        'postmark' => [
            'transport' => 'postmark',
            // 'message_stream_id' => null,
            // 'client' => [
            //     'timeout' => 5,
            // ],
        ],

        'mailgun' => [
            'transport' => 'mailgun',
            // 'client' => [
            //     'timeout' => 5,
            // ],
        ],

        'sendmail' => [
            'transport' => 'sendmail',
            'path' => env('MAIL_SENDMAIL_PATH', '/usr/sbin/sendmail -bs -i'),
        ],

        'log' => [
            'transport' => 'log',
            'channel' => env('MAIL_LOG_CHANNEL'),
        ],

        'array' => [
            'transport' => 'array',
        ],

        'failover' => [
            'transport' => 'failover',
            'mailers' => [
                'smtp',
                'log',
            ],
        ],

        'roundrobin' => [
            'transport' => 'roundrobin',
            'mailers' => [
                'ses',
                'postmark',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Adresse globale d’expédition
    |--------------------------------------------------------------------------
    |
    | Vous pouvez définir ici le nom et l’adresse utilisés globalement pour
    | tous les courriels envoyés par l’application.
    |
    */

    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'hello@example.com'),
        'name' => env('MAIL_FROM_NAME', 'Example'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Réglages des courriels Markdown
    |--------------------------------------------------------------------------
    |
    | Si les courriels utilisent Markdown, configurez ici le thème et les
    | chemins des composants afin de personnaliser leur présentation.
    |
    */

    'markdown' => [
        'theme' => 'default',

        'paths' => [
            resource_path('views/vendor/mail'),
        ],
    ],

];
