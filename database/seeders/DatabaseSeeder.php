<?php

namespace Database\Seeders;

use App\Models\Collecte;
use App\Models\Conseil;
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

        User::factory()->count(5)->create();

        $signalements = Signalement::factory()
            ->count(8)
            ->create(['user_id' => $citoyen->id]);

        Collecte::factory()->create([
            'signalement_id' => $signalements->first()->id,
            'statut' => 'planifiee',
        ]);

        Notification::factory()->count(3)->create(['user_id' => $citoyen->id]);
        Conseil::factory()->count(5)->create();

        $this->call(ConseilSeeder::class);
    }
}
