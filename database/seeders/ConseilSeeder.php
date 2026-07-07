<?php

namespace Database\Seeders;

use App\Models\Conseil;
use Illuminate\Database\Seeder;

class ConseilSeeder extends Seeder
{
    public function run(): void
    {
        $conseils = [
            [
                'titre' => 'Trier les déchets plastiques',
                'contenu' => 'Séparez les bouteilles, sachets et emballages plastiques afin de faciliter leur collecte et leur recyclage.',
                'categorie' => 'Tri des déchets',
                'image_path' => null,
            ],
            [
                'titre' => 'Réduire les déchets organiques',
                'contenu' => 'Les restes alimentaires peuvent être valorisés par le compostage au lieu d’être mélangés aux déchets ménagers.',
                'categorie' => 'Déchets organiques',
                'image_path' => null,
            ],
            [
                'titre' => 'Éviter les dépôts sauvages',
                'contenu' => 'Ne déposez pas les ordures dans les rues ou les caniveaux. Utilisez les points de collecte prévus.',
                'categorie' => 'Salubrité urbaine',
                'image_path' => null,
            ],
        ];

        foreach ($conseils as $conseil) {
            Conseil::firstOrCreate(
                ['titre' => $conseil['titre']],
                $conseil
            );
        }
    }
}
