<?php

namespace Database\Seeders;

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
        if (Signalement::count() === 0) {
            $this->call(DemoSeeder::class);
        }

        $this->call(ConseilSeeder::class);
    }
}
