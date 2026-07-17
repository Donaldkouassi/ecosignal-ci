<?php

namespace Tests\Feature;

use App\Models\Signalement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SignalementApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_la_creation_exige_une_authentification(): void
    {
        $this->postJson('/api/signalements', [
            'commune' => 'Cocody',
            'categorie' => 'mixte',
            'description' => 'Un dépôt sauvage est visible près de la route.',
        ])->assertUnauthorized();
    }

    public function test_un_citoyen_peut_creer_un_signalement_a_son_nom(): void
    {
        $citoyen = User::factory()->create();
        Sanctum::actingAs($citoyen);

        $response = $this->postJson('/api/signalements', [
            'commune' => 'Cocody',
            'categorie' => 'mixte',
            'description' => 'Un dépôt sauvage est visible près de la route.',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.user_id', $citoyen->id)
            ->assertJsonPath('data.statut', 'en_attente');

        $this->assertDatabaseHas('signalements', [
            'user_id' => $citoyen->id,
            'commune' => 'Cocody',
        ]);
    }

    public function test_un_citoyen_ne_voit_que_ses_signalements(): void
    {
        $citoyen = User::factory()->create();
        $autre = User::factory()->create();
        Signalement::factory()->create(['user_id' => $citoyen->id]);
        Signalement::factory()->create(['user_id' => $autre->id]);
        Sanctum::actingAs($citoyen);

        $response = $this->getJson('/api/signalements');

        $response->assertOk()->assertJsonCount(1, 'data');
        $this->assertSame($citoyen->id, $response->json('data.0.user_id'));
    }

    public function test_un_administrateur_voit_tous_les_signalements(): void
    {
        $admin = User::factory()->admin()->create();
        Signalement::factory()->count(2)->create();
        Sanctum::actingAs($admin);

        $this->getJson('/api/signalements')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_un_administrateur_peut_modifier_le_statut(): void
    {
        $admin = User::factory()->admin()->create();
        $signalement = Signalement::factory()->create(['statut' => 'en_attente']);
        Sanctum::actingAs($admin);

        $this->patchJson("/api/signalements/{$signalement->id}/statut", [
            'statut' => 'en_cours',
        ])->assertOk()->assertJsonPath('data.statut', 'en_cours');
    }

    public function test_un_citoyen_ne_peut_pas_modifier_le_statut(): void
    {
        $citoyen = User::factory()->create();
        $signalement = Signalement::factory()->create();
        Sanctum::actingAs($citoyen);

        $this->patchJson("/api/signalements/{$signalement->id}/statut", [
            'statut' => 'en_cours',
        ])->assertForbidden();
    }

    public function test_un_citoyen_ne_peut_pas_supprimer_un_signalement(): void
    {
        $citoyen = User::factory()->create();
        $signalement = Signalement::factory()->create(['user_id' => $citoyen->id]);
        Sanctum::actingAs($citoyen);

        $this->deleteJson("/api/signalements/{$signalement->id}")->assertForbidden();
    }
}
