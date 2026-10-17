<?php

namespace Database\Seeders;

use App\Models\Collecte;
use App\Models\Notification;
use App\Models\Signalement;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

/**
 * Données de démonstration réalistes (fictives) pour présenter EcoSignal CI.
 * Les dates sont calculées par rapport au jour du seed, pour que le graphique
 * d'évolution sur 6 mois reste représentatif quel que soit le moment de la démo.
 */
class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $citoyens = collect([
            ['prenom' => 'Aminata', 'nom' => 'Traoré', 'email' => 'aminata.traore@demo.ecosignal.ci'],
            ['prenom' => 'Yao', 'nom' => 'Konan', 'email' => 'yao.konan@demo.ecosignal.ci'],
            ['prenom' => 'Fatou', 'nom' => 'Bamba', 'email' => 'fatou.bamba@demo.ecosignal.ci'],
            ['prenom' => 'Serge', 'nom' => 'Gnahoré', 'email' => 'serge.gnahore@demo.ecosignal.ci'],
            ['prenom' => 'Mariam', 'nom' => 'Ouattara', 'email' => 'mariam.ouattara@demo.ecosignal.ci'],
        ])->map(fn ($c) => User::firstOrCreate(
            ['email' => $c['email']],
            $c + ['password' => Hash::make('password123'), 'role' => 'citoyen']
        ));

        $citoyenDemo = User::where('email', 'citoyen@ecosignal.ci')->first();
        $auteurs = $citoyens->push($citoyenDemo)->filter()->values();

        // [commune, catégorie, description, lat, lng, il y a N jours, statut, jours avant résolution]
        $signalements = [
            ['Abobo', 'mixte', "Tas de déchets ménagers au carrefour Samaké, qui déborde sur la chaussée.", 5.4231, -4.0179, 152, 'resolu', 4],
            ['Abobo', 'plastique', 'Sachets et bouteilles plastiques accumulés le long du caniveau près du marché.', 5.4302, -4.0215, 140, 'resolu', 6],
            ['Yopougon', 'organique', 'Restes de marché (feuilles, épluchures) en décomposition à Siporex, fortes odeurs.', 5.3402, -4.0739, 131, 'resolu', 3],
            ['Adjamé', 'mixte', "Tas de déchets derrière la gare routière, bloque l'accès piéton.", 5.3624, -4.0233, 118, 'resolu', 5],
            ['Koumassi', 'plastique', 'Bouteilles plastiques et emballages charriés par les pluies au bord de la lagune.', 5.2947, -3.9512, 109, 'resolu', 7],
            ['Treichville', 'encombrant', 'Vieux matelas et carcasses de meubles abandonnés sur le trottoir avenue 16.', 5.2921, -4.0089, 97, 'resolu', 2],
            ['Cocody', 'mixte', "Déchets accumulés à l'entrée d'un chantier à Angré, attirent les rongeurs.", 5.3989, -3.9871, 88, 'resolu', 4],
            ['Yopougon', 'plastique', 'Caniveau obstrué par des sachets plastiques à Niangon, risque d\'inondation.', 5.3311, -4.0902, 79, 'resolu', 5],
            ['Port-Bouët', 'organique', 'Déchets de poissonnerie déposés en bord de route près de Vridi.', 5.2563, -3.9634, 71, 'resolu', 3],
            ['Marcory', 'encombrant', 'Pneus usagés et ferraille entassés sur un terrain vague à Zone 4.', 5.2998, -3.9806, 64, 'resolu', 6],
            ['Abobo', 'organique', 'Ordures ménagères non ramassées depuis une semaine à Avocatier.', 5.4410, -4.0307, 55, 'resolu', 2],
            ['Attécoubé', 'mixte', 'Pente couverte de déchets qui glissent vers la lagune après chaque pluie.', 5.3325, -4.0427, 47, 'en_cours', null],
            ['Yopougon', 'mixte', 'Tas de déchets qui grandit derrière le marché de Wassakara.', 5.3458, -4.0811, 40, 'resolu', 3],
            ['Bouaké', 'plastique', 'Sachets plastiques dispersés autour du grand marché, quartier Commerce.', 7.6906, -5.0300, 34, 'en_cours', null],
            ['Adjamé', 'plastique', 'Bouteilles et gobelets plastiques jetés en masse près du forum des marchés.', 5.3579, -4.0261, 28, 'en_cours', null],
            ['Cocody', 'encombrant', "Déchets de construction (gravats, sacs de ciment) déposés en bordure de voie à Riviera 3.", 5.3712, -3.9583, 23, 'en_cours', null],
            ['Abobo', 'mixte', "Tas d'ordures au pied d'une école primaire à PK18, enfants exposés.", 5.4518, -4.0396, 19, 'en_cours', null],
            ['Yamoussoukro', 'organique', 'Déchets de marché non collectés au quartier Dioulakro.', 6.8206, -5.2767, 15, 'en_attente', null],
            ['Koumassi', 'mixte', 'Déchets accumulés près du terminus des bus 11, odeurs et moustiques.', 5.2871, -3.9447, 12, 'en_cours', null],
            ['Yopougon', 'plastique', "Emballages plastiques brûlés à ciel ouvert à Toits Rouges, fumée dans les habitations.", 5.3266, -4.0663, 9, 'en_attente', null],
            ['Treichville', 'organique', "Déchets alimentaires d'un maquis jetés dans le caniveau rue 12.", 5.2963, -4.0127, 7, 'en_attente', null],
            ['San-Pédro', 'plastique', 'Déchets plastiques échoués sur la plage du Bardot après la marée.', 4.7485, -6.6363, 5, 'en_attente', null],
            ['Marcory', 'mixte', "Déchets laissés près de l'arrêt de bus Anoumabo.", 5.3045, -3.9908, 3, 'en_attente', null],
            ['Abobo', 'plastique', 'Bouteilles plastiques et sachets bouchant le caniveau principal de Sagbé.', 5.4287, -4.0489, 1, 'en_attente', null],
        ];

        $equipes = ['Équipe pré-collecte Abobo', 'Équipe pré-collecte Yopougon', 'Brigade salubrité Sud', 'Équipe mobile Centre'];

        foreach ($signalements as $index => [$commune, $categorie, $description, $lat, $lng, $joursAvant, $statut, $joursResolution]) {
            $auteur = $auteurs[$index % $auteurs->count()];
            $creeLe = Carbon::now()->subDays($joursAvant)->setTime(8 + ($index % 10), ($index * 7) % 60);
            $misAJourLe = $joursResolution !== null ? $creeLe->copy()->addDays($joursResolution) : $creeLe->copy()->addHours(5);

            $signalement = new Signalement([
                'user_id' => $auteur->id,
                'commune' => $commune,
                'categorie' => $categorie,
                'description' => $description,
                'latitude' => $lat,
                'longitude' => $lng,
                'statut' => $statut,
            ]);
            $signalement->timestamps = false;
            $signalement->created_at = $creeLe;
            $signalement->updated_at = $statut === 'en_attente' ? $creeLe : $misAJourLe;
            $signalement->save();

            if ($statut === 'en_attente') {
                continue;
            }

            $datePassage = $statut === 'resolu'
                ? $misAJourLe->copy()->startOfDay()
                : Carbon::now()->addDays(1 + ($index % 4))->startOfDay();

            $collecte = new Collecte([
                'signalement_id' => $signalement->id,
                'date_passage' => $datePassage->toDateString(),
                'equipe_assignee' => $equipes[$index % count($equipes)],
                'statut' => $statut === 'resolu' ? 'terminee' : 'planifiee',
            ]);
            $collecte->timestamps = false;
            $collecte->created_at = $creeLe->copy()->addHours(5);
            $collecte->updated_at = $statut === 'resolu' ? $misAJourLe : $collecte->created_at;
            $collecte->save();

            $this->notifier($auteur->id, 'Collecte planifiée', sprintf(
                'Une collecte est prévue le %s pour votre signalement à %s.',
                $datePassage->format('d/m/Y'),
                $commune
            ), $creeLe->copy()->addHours(5), $statut === 'resolu');

            if ($statut === 'resolu') {
                $this->notifier($auteur->id, 'Signalement résolu', sprintf(
                    'Le dépôt que vous avez signalé à %s a été collecté. Merci pour votre engagement !',
                    $commune
                ), $misAJourLe, $index % 3 !== 0);
            }
        }
    }

    private function notifier(int $userId, string $titre, string $message, Carbon $date, bool $lue): void
    {
        $notification = new Notification([
            'user_id' => $userId,
            'titre' => $titre,
            'message' => $message,
            'lue' => $lue,
        ]);
        $notification->timestamps = false;
        $notification->created_at = $date;
        $notification->updated_at = $date;
        $notification->save();
    }
}
