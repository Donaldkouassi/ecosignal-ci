<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_un_citoyen_peut_creer_un_compte(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'nom' => 'Kouassi',
            'prenom' => 'Donald',
            'email' => 'donald@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['message', 'user' => ['id', 'nom', 'prenom', 'email', 'role'], 'token'])
            ->assertJsonPath('user.role', 'citoyen');

        $this->assertDatabaseHas('users', ['email' => 'donald@example.com']);
    }

    public function test_un_email_deja_utilise_est_refuse(): void
    {
        User::factory()->create(['email' => 'donald@example.com']);

        $response = $this->postJson('/api/auth/register', [
            'nom' => 'Kouassi',
            'prenom' => 'Donald',
            'email' => 'donald@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors('email');
    }

    public function test_un_utilisateur_peut_se_connecter(): void
    {
        User::factory()->create([
            'email' => 'donald@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'donald@example.com',
            'password' => 'password123',
        ]);

        $response->assertOk()->assertJsonStructure(['user', 'token']);
    }

    public function test_des_identifiants_invalides_sont_refuses(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'inconnu@example.com',
            'password' => 'mauvaismotdepasse',
        ]);

        $response->assertUnauthorized();
    }
}
