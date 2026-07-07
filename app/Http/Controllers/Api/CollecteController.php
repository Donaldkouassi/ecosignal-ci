<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Collecte;
use App\Models\Notification;
use App\Models\Signalement;
use Illuminate\Http\Request;

class CollecteController extends Controller
{
    // Liste des collectes
    public function index()
    {
        return response()->json(Collecte::with('signalement')->paginate(10));
    }

    // Créer une collecte
    public function store(Request $request)
    {
        $validated = $request->validate([
            'signalement_id' => 'required|exists:signalements,id',
            'date_passage' => 'required|date',
            'equipe_assignee' => 'required|string',
        ]);

        $collecte = Collecte::create($validated);

        // Notifier le citoyen
        $signalement = Signalement::find($validated['signalement_id']);
        Notification::create([
            'user_id' => $signalement->user_id,
            'titre' => 'Collecte planifiée',
            'message' => "Une collecte est prévue pour votre signalement le " . $validated['date_passage'] . ".",
        ]);

        return response()->json($collecte, 201);
    }

    // Mettre à jour une collecte
    public function update(Request $request, $id)
    {
        $collecte = Collecte::findOrFail($id);
        $validated = $request->validate([
            'date_passage' => 'sometimes|date',
            'equipe_assignee' => 'sometimes|string',
            'statut' => 'sometimes|in:planifiee,terminee',
        ]);

        $collecte->update($validated);
        return response()->json($collecte);
    }

    // Supprimer une collecte
    public function destroy($id)
    {
        $collecte = Collecte::findOrFail($id);
        $collecte->delete();
        return response()->json(null, 204);
    }
}