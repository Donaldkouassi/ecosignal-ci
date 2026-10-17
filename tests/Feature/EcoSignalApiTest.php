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
        Signalement::factory()->create(['statut' => 'en_attente', 'categorie' => 'plastique']);
        Signalement::factory()->create(['statut' => 'resolu', 'categorie' => 'organique']);

        $response = $this->getJson('/api/statistiques');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'total_signalements',
            'en_attente',
            'en_cours',
            'resolus',
            'par_commune',
            'par_categorie',
            'evolution_mensuelle' => [
                '*' => ['mois', 'label', 'total'],
            ],
        ]);
        $response->assertJsonPath('total_signalements', 2);
        $response->assertJsonCount(6, 'evolution_mensuelle');
    }

    public function test_statistiques_indicateurs_impact(): void
    {
        $resolu = Signalement::factory()->create(['statut' => 'resolu']);
        $resolu->timestamps = false;
        $resolu->created_at = now()->subDays(4);
        $resolu->updated_at = now();
        $resolu->save();
        Signalement::factory()->create(['statut' => 'en_attente']);

        $response = $this->getJson('/api/statistiques');

        $response->assertStatus(200)
            ->assertJsonPath('taux_resolution', 50)
            ->assertJsonPath('delai_moyen_resolution_jours', 4)
            ->assertJsonPath('collectes_terminees', 0);
    }

    public function test_statistiques_sans_signalement_resolu(): void
    {
        Signalement::factory()->create(['statut' => 'en_attente']);

        $this->getJson('/api/statistiques')
            ->assertStatus(200)
            ->assertJsonPath('taux_resolution', 0)
            ->assertJsonPath('delai_moyen_resolution_jours', null);
    }

    public function test_carte_publique_sans_donnees_personnelles(): void
    {
        Signalement::factory()->create(['latitude' => 5.35, 'longitude' => -4.01, 'description' => 'Texte privé']);
        Signalement::factory()->create(['latitude' => null, 'longitude' => null]);

        $response = $this->getJson('/api/carte');

        $response->assertStatus(200)->assertJsonCount(1);
        $this->assertSame(['id', 'latitude', 'longitude', 'statut', 'categorie', 'commune'], array_keys($response->json()[0]));
        $this->assertStringNotContainsString('Texte privé', $response->getContent());
    }
}
