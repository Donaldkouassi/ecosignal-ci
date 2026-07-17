<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Valeurs d’authentification par défaut
    |--------------------------------------------------------------------------
    |
    | Cette option définit le garde d’authentification et la configuration
    | de réinitialisation des mots de passe utilisés par défaut.
    |
    */

    'defaults' => [
        'guard' => 'web',
        'passwords' => 'users',
    ],

    /*
    |--------------------------------------------------------------------------
    | Gardes d’authentification
    |--------------------------------------------------------------------------
    |
    | Définissez ici les gardes d’authentification de l’application. La
    | configuration fournie utilise les sessions et le fournisseur Eloquent.
    |
    | Chaque pilote utilise un fournisseur qui détermine comment les
    | utilisateurs sont récupérés depuis la base ou un autre stockage.
    |
    | Pris en charge : « session »
    |
    */

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Fournisseurs d’utilisateurs
    |--------------------------------------------------------------------------
    |
    | Chaque pilote d’authentification utilise un fournisseur qui détermine
    | comment les utilisateurs sont récupérés depuis le stockage.
    |
    | Si plusieurs tables ou modèles d’utilisateurs existent, configurez
    | plusieurs sources et associez-les aux gardes correspondants.
    |
    | Pris en charge : « database », « eloquent »
    |
    */

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class,
        ],

        // 'users' => [
        //     'driver' => 'database',
        //     'table' => 'users',
        // ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Réinitialisation des mots de passe
    |--------------------------------------------------------------------------
    |
    | Plusieurs configurations peuvent être définies lorsque l’application
    | possède différents types ou modèles d’utilisateurs.
    |
    | La durée d’expiration correspond au nombre de minutes pendant lesquelles
    | un jeton reste valide. Une durée courte réduit les risques de devinette.
    |
    | La limitation indique le délai en secondes avant de pouvoir générer un
    | nouveau jeton et empêche la création massive de jetons.
    |
    */

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => 'password_reset_tokens',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Délai de confirmation du mot de passe
    |--------------------------------------------------------------------------
    |
    | Définissez ici le nombre de secondes avant l’expiration d’une confirmation
    | et la nouvelle saisie du mot de passe. Le délai par défaut est de trois heures.
    |
    */

    'password_timeout' => 10800,

];
