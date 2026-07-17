<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Signalement\StoreSignalementRequest;
use App\Http\Requests\Signalement\UpdateSignalementStatusRequest;
use App\Models\Signalement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class SignalementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'statut' => ['sometimes', 'string', Rule::in(['en_attente', 'en_cours', 'resolu'])],
            'commune' => ['sometimes', 'string', 'max:100'],
            'per_page' => ['sometimes', 'integer', 'between:1,50'],
            'page' => ['sometimes', 'integer', 'min:1'],
        ]);

        $query = Signalement::query()
            ->with(['user:id,nom,prenom,email', 'collecte'])
            ->latest();

        if ($request->user()->role !== 'admin') {
            $query->where('user_id', $request->user()->id);
        }

        if (isset($filters['statut'])) {
            $query->where('statut', $filters['statut']);
        }

        if (isset($filters['commune'])) {
            $query->where('commune', $filters['commune']);
        }

        $perPage = $filters['per_page'] ?? 10;

        return response()->json($query->paginate($perPage));
    }

    public function show(Request $request, Signalement $signalement): JsonResponse
    {
        if ($request->user()->role !== 'admin' && $signalement->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Accès interdit.'], 403);
        }

        return response()->json($signalement->load(['user:id,nom,prenom,email', 'collecte']));
    }

    public function store(StoreSignalementRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $photoPath = $request->hasFile('photo')
            ? $request->file('photo')->store('signalements', 'public')
            : null;

        $signalement = Signalement::create([
            'user_id' => $request->user()->id,
            'commune' => $validated['commune'],
            'categorie' => $validated['categorie'],
            'description' => $validated['description'],
            'photo_path' => $photoPath,
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'statut' => 'en_attente',
        ]);

        return response()->json([
            'message' => 'Signalement enregistré avec succès.',
            'data' => $signalement,
        ], 201);
    }

    public function updateStatut(
        UpdateSignalementStatusRequest $request,
        Signalement $signalement
    ): JsonResponse {
        $signalement->update($request->validated());

        return response()->json([
            'message' => 'Statut mis à jour avec succès.',
            'data' => $signalement->fresh(),
        ]);
    }

    public function destroy(Request $request, Signalement $signalement): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Accès réservé aux administrateurs.'], 403);
        }

        if ($signalement->photo_path) {
            Storage::disk('public')->delete($signalement->photo_path);
        }

        $signalement->delete();

        return response()->json([
            'message' => 'Signalement supprimé avec succès.',
        ]);
    }
}
