<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Emplacements de stockage des vues
    |--------------------------------------------------------------------------
    |
    | La plupart des moteurs de modèles chargent les vues depuis le disque.
    | Indiquez ici les chemins dans lesquels les vues doivent être recherchées.
    | Le chemin habituel de Laravel est déjà enregistré.
    |
    */

    'paths' => [
        resource_path('views'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Emplacement des vues compilées
    |--------------------------------------------------------------------------
    |
    | Cette option détermine où sont stockés les modèles Blade compilés.
    | Ils se trouvent généralement dans le dossier de stockage, mais cette
    | valeur peut être modifiée.
    |
    */

    'compiled' => env(
        'VIEW_COMPILED_PATH',
        realpath(storage_path('framework/views'))
    ),

];
