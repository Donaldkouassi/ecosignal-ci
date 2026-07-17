<?php

use Laravel\Sanctum\Sanctum;

return [

    /*
    |--------------------------------------------------------------------------
    | Domaines avec état
    |--------------------------------------------------------------------------
    |
    | Les requêtes provenant de ces domaines reçoivent des cookies
    | d’authentification avec état. Incluez les domaines locaux et de
    | production utilisés par l’application monopage.
    |
    */

    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
        Sanctum::currentApplicationUrlWithPort()
    ))),

    /*
    |--------------------------------------------------------------------------
    | Gardes Sanctum
    |--------------------------------------------------------------------------
    |
    | Ce tableau contient les gardes vérifiés par Sanctum. Si aucun ne peut
    | authentifier la requête, Sanctum utilise le jeton porteur reçu.
    |
    */

    'guard' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Délai d’expiration en minutes
    |--------------------------------------------------------------------------
    |
    | Cette valeur détermine après combien de minutes un jeton expire. Elle
    | remplace l’attribut « expires_at », sans affecter les sessions internes.
    |
    */

    'expiration' => null,

    /*
    |--------------------------------------------------------------------------
    | Préfixe des jetons
    |--------------------------------------------------------------------------
    |
    | Sanctum peut préfixer les nouveaux jetons pour faciliter leur détection
    | par les outils de sécurité lorsqu’ils sont publiés accidentellement.
    |
    | Voir : https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning
    |
    */

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    /*
    |--------------------------------------------------------------------------
    | Middlewares Sanctum
    |--------------------------------------------------------------------------
    |
    | L’authentification d’une application monopage interne peut nécessiter
    | l’adaptation des middlewares utilisés par Sanctum.
    |
    */

    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
        'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
    ],

];
