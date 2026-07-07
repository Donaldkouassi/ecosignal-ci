<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'titre' => $this->faker->sentence(3),
            'message' => $this->faker->sentence(10),
            'lue' => $this->faker->boolean(30),
        ];
    }
}