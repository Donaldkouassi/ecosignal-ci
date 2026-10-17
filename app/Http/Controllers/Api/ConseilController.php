<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Conseil\StoreConseilRequest;
use App\Http\Requests\Conseil\UpdateConseilRequest;
use App\Models\Conseil;
use Illuminate\Http\JsonResponse;

class ConseilController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Conseil::latest()->get());
    }

    public function store(StoreConseilRequest $request): JsonResponse
    {
        $conseil = Conseil::create($request->validated());

        return response()->json([
            'message' => 'Conseil créé avec succès.',
            'data' => $conseil,
        ], 201);
    }

    public function update(UpdateConseilRequest $request, Conseil $conseil): JsonResponse
    {
        $conseil->update($request->validated());

        return response()->json([
            'message' => 'Conseil mis à jour avec succès.',
            'data' => $conseil->fresh(),
        ]);
    }

    public function destroy(Conseil $conseil): JsonResponse
    {
        $conseil->delete();

        return response()->json([
            'message' => 'Conseil supprimé avec succès.',
        ]);
    }
}
