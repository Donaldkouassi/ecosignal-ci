<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ConseilFactory extends Factory
{
    public function definition(): array
    {
        return [
            'titre' => $this->faker->sentence(4),
            'contenu' => $this->faker->paragraphs(3, true),
            'categorie' => $this->faker->randomElement(['tri', 'recyclage', 'compostage', 'sensibilisation']),
            'image_path' => null,
        ];
    }
}