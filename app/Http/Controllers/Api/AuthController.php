<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            ...$request->safe()->except('password'),
            'password' => Hash::make((string) $request->string('password')),
            'role' => 'citoyen',
        ]);

        return response()->json([
            'message' => 'Compte créé avec succès.',
            'user' => $user,
            'token' => $user->createToken('ecosignal-web')->plainTextToken,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->string('email'))->first();

        if (! $user || ! Hash::check((string) $request->string('password'), $user->password)) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect.',
            ], 401);
        }

        $user->tokens()->delete();

        return response()->json([
            'message' => 'Connexion réussie.',
            'user' => $user,
            'token' => $user->createToken('ecosignal-web')->plainTextToken,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Déconnexion réussie.',
        ]);
    }

    public function profile(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }
}
