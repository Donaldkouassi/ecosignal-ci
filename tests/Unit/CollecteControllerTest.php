<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Signalement;
use App\Models\Collecte;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CollecteControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_collecte()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $signalement = Signalement::factory()->create();

        $this->actingAs($admin);

        $response = $this->postJson('/api/collectes', [
            'signalement_id' => $signalement->id,
            'date_passage' => '2026-07-15',
            'equipe_assignee' => 'Équipe A',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('collectes', [
            'signalement_id' => $signalement->id,
            'equipe_assignee' => 'Équipe A',
        ]);
    }

    public function test_citizen_cannot_create_collecte()
    {
        $user = User::factory()->create(['role' => 'citoyen']);

        $this->actingAs($user);

        $response = $this->postJson('/api/collectes', [
            'signalement_id' => 1,
            'date_passage' => '2026-07-15',
            'equipe_assignee' => 'Équipe A',
        ]);

        $response->assertStatus(403);
    }
}