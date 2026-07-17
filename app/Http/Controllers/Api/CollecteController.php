<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Collecte\StoreCollecteRequest;
use App\Http\Requests\Collecte\UpdateCollecteRequest;
use App\Models\Collecte;
use App\Models\Notification;
use App\Models\Signalement;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CollecteController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Collecte::with('signalement.user:id,nom,prenom,email')
                ->latest('date_passage')
                ->paginate(10)
        );
    }

    public function store(StoreCollecteRequest $request): JsonResponse
    {
        $collecte = DB::transaction(function () use ($request) {
            $collecte = Collecte::create($request->validated());
            $signalement = Signalement::findOrFail($request->integer('signalement_id'));

            $signalement->update(['statut' => 'en_cours']);

            Notification::create([
                'user_id' => $signalement->user_id,
                'titre' => 'Collecte planifiée',
                'message' => sprintf(
                    'Une collecte est prévue le %s pour votre signalement à %s.',
                    $request->date('date_passage')->format('d/m/Y'),
                    $signalement->commune
                ),
            ]);

            return $collecte;
        });

        return response()->json([
            'message' => 'Collecte planifiée avec succès.',
            'data' => $collecte->load('signalement'),
        ], 201);
    }

    public function update(UpdateCollecteRequest $request, Collecte $collecte): JsonResponse
    {
        $collecte->update($request->validated());

        if ($collecte->statut === 'terminee') {
            $collecte->signalement()->update(['statut' => 'resolu']);
        }

        return response()->json([
            'message' => 'Collecte mise à jour avec succès.',
            'data' => $collecte->fresh('signalement'),
        ]);
    }

    public function destroy(Collecte $collecte): JsonResponse
    {
        $collecte->delete();

        return response()->json([
            'message' => 'Collecte supprimée avec succès.',
        ]);
    }
}
