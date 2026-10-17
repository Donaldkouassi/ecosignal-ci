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
                'titre' => 'Déposer ses déchets aux bons endroits',
                'contenu' => 'Gardez les rues et les caniveaux dégagés : déposez vos déchets aux points de collecte prévus.',
                'categorie' => 'Salubrité urbaine',
                'image_path' => null,
            ],
            [
                'titre' => 'Nettoyer les abords de son domicile',
                'contenu' => 'Balayez et entretenez régulièrement le trottoir et le caniveau devant chez vous : cela limite l’accumulation de déchets et la stagnation des eaux usées.',
                'categorie' => 'Salubrité urbaine',
                'image_path' => null,
            ],
            [
                'titre' => 'Les déchets, un risque pour la santé',
                'contenu' => 'Les ordures qui s’accumulent attirent moustiques, rats et insectes et favorisent la propagation du paludisme, du choléra et d’autres maladies. Un dépôt signalé rapidement, c’est un risque sanitaire évité.',
                'categorie' => 'Santé publique',
                'image_path' => null,
            ],
            [
                'titre' => 'Ne brûlez jamais vos déchets',
                'contenu' => 'Brûler les ordures à l’air libre dégage des fumées toxiques dangereuses pour les voies respiratoires, en particulier pour les enfants et les personnes âgées du voisinage.',
                'categorie' => 'Santé publique',
                'image_path' => null,
            ],
            [
                'titre' => 'Déchets et inondations : un lien direct',
                'contenu' => 'Les ordures jetées dans les caniveaux bouchent les canalisations et aggravent les inondations pendant la saison des pluies. Garder les caniveaux dégagés protège tout le quartier.',
                'categorie' => 'Santé publique',
                'image_path' => null,
            ],
            [
                'titre' => 'Signalez, ne détournez pas le regard',
                'contenu' => 'Face à un tas de déchets abandonné, un signalement fait en quelques minutes permet aux équipes de collecte d’intervenir avant que la situation ne s’aggrave.',
                'categorie' => 'Action citoyenne',
                'image_path' => null,
            ],
            [
                'titre' => 'Organisez un nettoyage de quartier',
                'contenu' => 'Mobilisez vos voisins pour une opération de salubrité collective : à plusieurs, le geste citoyen transforme durablement un quartier.',
                'categorie' => 'Action citoyenne',
                'image_path' => null,
            ],
            [
                'titre' => 'Sensibilisez votre entourage',
                'contenu' => 'Parlez du tri des déchets et du bon usage des points de collecte autour de vous : l’exemple individuel encourage les habitudes collectives.',
                'categorie' => 'Action citoyenne',
                'image_path' => null,
            ],
        ];

        // Mise à jour des formulations des premières versions (une seule fois, sans doublon).
        Conseil::where('titre', 'Éviter les dépôts sauvages')->update([
            'titre' => 'Déposer ses déchets aux bons endroits',
            'contenu' => 'Gardez les rues et les caniveaux dégagés : déposez vos déchets aux points de collecte prévus.',
        ]);
        Conseil::where('titre', 'Signalez, ne détournez pas le regard')
            ->where('contenu', 'like', 'Face à un dépôt sauvage%')
            ->update(['contenu' => 'Face à un tas de déchets abandonné, un signalement fait en quelques minutes permet aux équipes de collecte d’intervenir avant que la situation ne s’aggrave.']);

        foreach ($conseils as $conseil) {
            Conseil::firstOrCreate(
                ['titre' => $conseil['titre']],
                $conseil
            );
        }
    }
}
