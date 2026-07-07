<?php

namespace Database\Factories;

use App\Models\Signalement;
use Illuminate\Database\Eloquent\Factories\Factory;

class CollecteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'signalement_id' => Signalement::factory(),
            'date_passage' => $this->faker->dateTimeBetween('now', '+1 month'),
            'equipe_assignee' => $this->faker->company(),
            'statut' => $this->faker->randomElement(['planifiee', 'terminee']),
        ];
    }
}