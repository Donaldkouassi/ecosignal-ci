<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Signalement;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SignalementControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_citizen_can_create_signalement()
    {
        $user = User::factory()->create(['role' => 'citoyen']);
        $this->actingAs($user);

        $response = $this->postJson('/api/signalements', [
            'description' => 'Dépôt sauvage à Cocody',
            'categorie' => 'mixte',
            'commune' => 'Cocody',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('signalements', [
            'description' => 'Dépôt sauvage à Cocody',
            'user_id' => $user->id,
        ]);
    }

    public function test_admin_can_update_statut()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $signalement = Signalement::factory()->create(['statut' => 'en_attente']);

        $this->actingAs($admin);

        $response = $this->patchJson("/api/signalements/{$signalement->id}/statut", [
            'statut' => 'en_cours',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('signalements', [
            'id' => $signalement->id,
            'statut' => 'en_cours',
        ]);
    }

    public function test_non_admin_cannot_update_statut()
    {
        $user = User::factory()->create(['role' => 'citoyen']);
        $signalement = Signalement::factory()->create();

        $this->actingAs($user);

        $response = $this->patchJson("/api/signalements/{$signalement->id}/statut", [
            'statut' => 'en_cours',
        ]);

        $response->assertStatus(403);
    }
}