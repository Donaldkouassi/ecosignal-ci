<?php

namespace Tests\Feature;

use App\Models\Conseil;
use App\Models\Signalement;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EcoSignalApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_liste_des_conseils_accessible(): void
    {
        Conseil::factory()->create();

        $response = $this->getJson('/api/conseils');

        $response->assertStatus(200);
        $response->assertJsonCount(1);
    }

    public function test_statistiques_accessibles(): void
    {
        Signalement::factory()->create(['statut' => 'en_attente']);
        Signalement::factory()->create(['statut' => 'resolu']);

        $response = $this->getJson('/api/statistiques');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'total_signalements',
            'en_attente',
            'en_cours',
            'resolus',
            'par_commune',
        ]);
        $response->assertJsonPath('total_signalements', 2);
    }
}
