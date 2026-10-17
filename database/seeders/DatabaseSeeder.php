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

        $this->call(ConseilSeeder::class);
    }
}
