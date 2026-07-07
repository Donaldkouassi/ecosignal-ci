<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SignalementFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'photo_path' => null,
            'description' => $this->faker->sentence(rand(5, 15)),
            'categorie' => $this->faker->randomElement(['plastique', 'organique', 'encombrant', 'mixte', 'autre']),
            'commune' => $this->faker->randomElement(['Cocody', 'Yopougon', 'Marcory', 'Plateau', 'Abobo', 'Treichville']),
            'latitude' => $this->faker->latitude(5.2, 5.4),
            'longitude' => $this->faker->longitude(-4.1, -3.9),
            'statut' => $this->faker->randomElement(['en_attente', 'en_cours', 'resolu']),
        ];
    }
}