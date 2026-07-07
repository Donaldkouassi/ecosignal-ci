<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Signalement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class SignalementController extends Controller
{
    public function index()
    {
        return response()->json(
            Signalement::latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'commune' => 'required|string|max:100',
            'categorie' => 'required|string|in:plastique,organique,encombrant,mixte,autre',
            'description' => 'required|string|min:5',
        ]);

        $demoUser = User::firstOrCreate(
            ['email' => 'demo@ecosignal.ci'],
            [
                'nom' => 'Utilisateur',
                'prenom' => 'Démo',
                'password' => Hash::make('password'),
                'role' => 'citoyen',
            ]
        );

        $signalement = Signalement::create([
            'user_id' => $demoUser->id,
            'commune' => $validated['commune'],
            'categorie' => $validated['categorie'],
            'description' => $validated['description'],
            'statut' => 'en_attente',
        ]);

        return response()->json($signalement, 201);
    }

    public function updateStatut(Request $request, Signalement $signalement)
    {
        $validated = $request->validate([
            'statut' => 'required|string|in:en_attente,en_cours,resolu',
        ]);

        $signalement->update([
            'statut' => $validated['statut'],
        ]);

        return response()->json($signalement);
    }

    public function destroy(Signalement $signalement)
    {
        $signalement->delete();

        return response()->json([
            'message' => 'Signalement supprimé avec succès.'
        ]);
    }
}
