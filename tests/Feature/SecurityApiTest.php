<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SecurityApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_les_reponses_api_contiennent_les_entetes_de_securite(): void
    {
        $this->getJson('/api/statistiques')
            ->assertOk()
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('X-Frame-Options', 'DENY')
            ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
            ->assertHeader('Permissions-Policy', 'camera=(), microphone=(), payment=()');
    }

    public function test_les_tentatives_de_connexion_sont_limitees(): void
    {
        $payload = [
            'email' => 'attaque@example.com',
            'password' => 'motdepasseincorrect',
        ];

        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/auth/login', $payload)->assertUnauthorized();
        }

        $this->postJson('/api/auth/login', $payload)
            ->assertStatus(429)
            ->assertHeader('Retry-After');
    }

    public function test_un_filtre_de_statut_invalide_est_refuse(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->getJson('/api/signalements?statut=statut-inconnu')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('statut');
    }
}
