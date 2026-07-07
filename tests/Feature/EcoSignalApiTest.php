<?php

namespace Tests\Feature;

use App\Models\Signalement;
use Tests\TestCase;

class EcoSignalApiTest extends TestCase
{
    public function test_liste_des_signalements_accessible(): void
    {
        $response = $this->getJson('/api/signalements');

        $response->assertStatus(200);
    }

    public function test_creation_signalement_via_api(): void
    {
        $response = $this->postJson('/api/signalements', [
            'commune' => 'Abobo',
            'categorie' => 'mixte',
            'description' => 'Signalement de test automatisé EcoSignal CI.',
        ]);

        $response->assertStatus(201);
        $response->assertJsonFragment([
            'commune' => 'Abobo',
            'categorie' => 'mixte',
            'statut' => 'en_attente',
        ]);

        $id = $response->json('id');

        Signalement::destroy($id);
    }

    public function test_liste_des_conseils_accessible(): void
    {
        $response = $this->getJson('/api/conseils');

        $response->assertStatus(200);
    }

    public function test_statistiques_accessibles(): void
    {
        $response = $this->getJson('/api/statistiques');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'total_signalements',
            'en_attente',
            'en_cours',
            'resolus',
            'par_commune',
        ]);
    }
}
