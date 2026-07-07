<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Signalement;
use Illuminate\Support\Facades\DB;

class StatistiqueController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_signalements' => Signalement::count(),
            'en_attente' => Signalement::where('statut', 'en_attente')->count(),
            'en_cours' => Signalement::where('statut', 'en_cours')->count(),
            'resolus' => Signalement::where('statut', 'resolu')->count(),
            'par_commune' => Signalement::select('commune', DB::raw('COUNT(*) as total'))
                ->groupBy('commune')
                ->orderByDesc('total')
                ->get(),
        ]);
    }
}
