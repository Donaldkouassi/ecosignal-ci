<?php

namespace Tests\Feature;

use App\Models\Conseil;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ConseilApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_un_administrateur_peut_creer_un_conseil(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/conseils', [
            'titre' => 'Ne brûlez jamais vos déchets',
            'contenu' => 'Brûler les ordures dégage des fumées toxiques dangereuses pour la santé.',
            'categorie' => 'Santé publique',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('conseils', ['titre' => 'Ne brûlez jamais vos déchets']);
    }

    public function test_un_citoyen_ne_peut_pas_creer_un_conseil(): void
    {
        $citoyen = User::factory()->create();
        Sanctum::actingAs($citoyen);

        $this->postJson('/api/conseils', [
            'titre' => 'Ne brûlez jamais vos déchets',
            'contenu' => 'Brûler les ordures dégage des fumées toxiques dangereuses pour la santé.',
            'categorie' => 'Santé publique',
        ])->assertForbidden();
    }

    public function test_un_administrateur_peut_modifier_un_conseil(): void
    {
        $admin = User::factory()->admin()->create();
        $conseil = Conseil::factory()->create(['titre' => 'Ancien titre']);
        Sanctum::actingAs($admin);

        $response = $this->patchJson("/api/conseils/{$conseil->id}", [
            'titre' => 'Nouveau titre',
            'contenu' => $conseil->contenu,
            'categorie' => $conseil->categorie,
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('conseils', ['id' => $conseil->id, 'titre' => 'Nouveau titre']);
    }

    public function test_un_citoyen_ne_peut_pas_modifier_un_conseil(): void
    {
        $citoyen = User::factory()->create();
        $conseil = Conseil::factory()->create();
        Sanctum::actingAs($citoyen);

        $this->patchJson("/api/conseils/{$conseil->id}", [
            'titre' => 'Nouveau titre',
            'contenu' => $conseil->contenu,
            'categorie' => $conseil->categorie,
        ])->assertForbidden();
    }

    public function test_un_administrateur_peut_supprimer_un_conseil(): void
    {
        $admin = User::factory()->admin()->create();
        $conseil = Conseil::factory()->create();
        Sanctum::actingAs($admin);

        $this->deleteJson("/api/conseils/{$conseil->id}")->assertOk();
        $this->assertDatabaseMissing('conseils', ['id' => $conseil->id]);
    }

    public function test_un_citoyen_ne_peut_pas_supprimer_un_conseil(): void
    {
        $citoyen = User::factory()->create();
        $conseil = Conseil::factory()->create();
        Sanctum::actingAs($citoyen);

        $this->deleteJson("/api/conseils/{$conseil->id}")->assertForbidden();
        $this->assertDatabaseHas('conseils', ['id' => $conseil->id]);
    }
}
