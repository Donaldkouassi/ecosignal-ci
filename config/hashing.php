<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Pilote de hachage par défaut
    |--------------------------------------------------------------------------
    |
    | Cette option définit le pilote utilisé par défaut pour hacher les mots
    | de passe. L’algorithme bcrypt est utilisé par défaut, mais cette valeur
    | peut être modifiée.
    |
    | Pris en charge : « bcrypt », « argon », « argon2id »
    |
    */

    'driver' => 'bcrypt',

    /*
    |--------------------------------------------------------------------------
    | Options de Bcrypt
    |--------------------------------------------------------------------------
    |
    | Configurez ici les options utilisées par l’algorithme Bcrypt afin de
    | contrôler notamment le temps nécessaire au hachage d’un mot de passe.
    |
    */

    'bcrypt' => [
        'rounds' => env('BCRYPT_ROUNDS', 12),
        'verify' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Options d’Argon
    |--------------------------------------------------------------------------
    |
    | Configurez ici les options utilisées par l’algorithme Argon afin de
    | contrôler notamment le temps nécessaire au hachage d’un mot de passe.
    |
    */

    'argon' => [
        'memory' => 65536,
        'threads' => 1,
        'time' => 4,
        'verify' => true,
    ],

];
