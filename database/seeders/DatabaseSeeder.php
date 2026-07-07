<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Signalement;
use App\Models\Collecte;
use App\Models\Conseil;
use App\Models\Notification;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Créer un admin
        User::create([
            'nom' => 'Admin',
            'prenom' => 'Eco',
            'email' => 'admin@ecosignal.ci',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Créer 10 citoyens
        User::factory(10)->create();

        // Créer 20 signalements
        Signalement::factory(20)->create();

        // Créer 5 collectes (liées à des signalements existants)
        Collecte::factory(5)->create();

        // Créer 10 conseils
        Conseil::factory(10)->create();

        // Créer 15 notifications
        Notification::factory(15)->create();
    }
}