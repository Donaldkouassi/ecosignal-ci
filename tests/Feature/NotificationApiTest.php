<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NotificationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_un_utilisateur_ne_voit_que_ses_notifications(): void
    {
        $utilisateur = User::factory()->create();
        $autre = User::factory()->create();
        Notification::factory()->create(['user_id' => $utilisateur->id]);
        Notification::factory()->create(['user_id' => $autre->id]);
        Sanctum::actingAs($utilisateur);

        $this->getJson('/api/notifications')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_un_utilisateur_peut_marquer_sa_notification_comme_lue(): void
    {
        $utilisateur = User::factory()->create();
        $notification = Notification::factory()->create([
            'user_id' => $utilisateur->id,
            'lue' => false,
        ]);
        Sanctum::actingAs($utilisateur);

        $this->patchJson("/api/notifications/{$notification->id}/lue")
            ->assertOk()
            ->assertJsonPath('data.lue', true);
    }
}
