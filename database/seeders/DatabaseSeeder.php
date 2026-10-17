<?php

namespace Database\Seeders;

use App\Models\Collecte;
use App\Models\Notification;
use App\Models\Signalement;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@ecosignal.ci'],
            [
                'nom' => 'Administration',
                'prenom' => 'EcoSignal',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]
        );

        $motDePasseAdmin = config('app.admin_password');

        if ($motDePasseAdmin && ! Hash::check($motDePasseAdmin, $admin->password)) {
            $admin->forceFill(['password' => Hash::make($motDePasseAdmin)])->save();
        }

        $citoyen = User::firstOrCreate(
            ['email' => 'citoyen@ecosignal.ci'],
            [
                'nom' => 'Kouassi',
                'prenom' => 'Citoyen',
                'password' => Hash::make('password123'),
                'role' => 'citoyen',
            ]
        );

        // Ce bloc ne crée des données de démonstration qu'une seule fois : le
        // conteneur relance ce seeder à chaque démarrage (le plan gratuit de
        // Render ne permet pas de lancer une commande ponctuelle via un shell),
        // il ne doit donc pas dupliquer les signalements à chaque redémarrage.
        // Remise à zéro unique : si DEMO_RESET=true et que les données de
        // démonstration réalistes ne sont pas encore installées, on retire les
        // anciens signalements de test. Une fois les comptes de démo créés,
        // ce bloc ne s'exécute plus, même si la variable reste activée.
        $demoInstallee = User::where('email', 'like', '%@demo.ecosignal.ci')->exists();

        if (config('app.demo_reset') && ! $demoInstallee) {
            Notification::query()->delete();
            Collecte::query()->delete();
            Signalement::query()->delete();
        }

        if (Signalement::count() === 0) {
            $this->call(DemoSeeder::class);
        }

        // Formulations plus respectueuses pour les données de démonstration déjà installées.
        foreach ([
            "Dépôt sauvage d'ordures ménagères au carrefour Samaké, déborde sur la chaussée." => 'Tas de déchets ménagers au carrefour Samaké, qui déborde sur la chaussée.',
            "Dépôt sauvage à l'entrée d'un chantier à Angré, attire les rongeurs." => "Déchets accumulés à l'entrée d'un chantier à Angré, attirent les rongeurs.",
            'Dépôt sauvage grandissant derrière le marché de Wassakara.' => 'Tas de déchets qui grandit derrière le marché de Wassakara.',
            'Dépôt sauvage près du terminus des bus 11, odeurs et moustiques.' => 'Déchets accumulés près du terminus des bus 11, odeurs et moustiques.',
            "Dépôt sauvage près de l'arrêt de bus Anoumabo." => "Déchets laissés près de l'arrêt de bus Anoumabo.",
        ] as $ancien => $nouveau) {
            Signalement::where('description', $ancien)->update(['description' => $nouveau]);
        }

        $this->call(ConseilSeeder::class);
    }
}
