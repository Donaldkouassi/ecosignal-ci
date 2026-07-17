<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\Signalement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CollecteApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_un_administrateur_peut_planifier_une_collecte(): void
    {
        $admin = User::factory()->admin()->create();
        $signalement = Signalement::factory()->create(['statut' => 'en_attente']);
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/collectes', [
            'signalement_id' => $signalement->id,
            'date_passage' => now()->addDay()->toDateString(),
            'equipe_assignee' => 'Équipe A',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('collectes', ['signalement_id' => $signalement->id]);
        $this->assertDatabaseHas('signalements', ['id' => $signalement->id, 'statut' => 'en_cours']);
        $this->assertDatabaseHas('notifications', ['user_id' => $signalement->user_id]);
    }

    public function test_un_citoyen_ne_peut_pas_planifier_une_collecte(): void
    {
        $citoyen = User::factory()->create();
        $signalement = Signalement::factory()->create();
        Sanctum::actingAs($citoyen);

        $this->postJson('/api/collectes', [
            'signalement_id' => $signalement->id,
            'date_passage' => now()->addDay()->toDateString(),
            'equipe_assignee' => 'Équipe A',
        ])->assertForbidden();
    }

    public function test_une_seule_collecte_est_autorisee_par_signalement(): void
    {
        $admin = User::factory()->admin()->create();
        $signalement = Signalement::factory()->create();
        Sanctum::actingAs($admin);

        $payload = [
            'signalement_id' => $signalement->id,
            'date_passage' => now()->addDay()->toDateString(),
            'equipe_assignee' => 'Équipe A',
        ];

        $this->postJson('/api/collectes', $payload)->assertCreated();
        $this->postJson('/api/collectes', $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors('signalement_id');
    }
}
