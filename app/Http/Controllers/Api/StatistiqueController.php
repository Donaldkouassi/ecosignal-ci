<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Collecte;
use App\Models\Signalement;
use Illuminate\Support\Carbon;
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
            'par_categorie' => Signalement::select('categorie', DB::raw('COUNT(*) as total'))
                ->groupBy('categorie')
                ->orderByDesc('total')
                ->get(),
            'evolution_mensuelle' => $this->evolutionMensuelle(),
            'taux_resolution' => $this->tauxResolution(),
            'delai_moyen_resolution_jours' => $this->delaiMoyenResolution(),
            'collectes_terminees' => Collecte::where('statut', 'terminee')->count(),
        ]);
    }

    /**
     * Points publics pour la carte de l'accueil : position, statut, type et commune.
     * Aucune donnée personnelle (auteur, description, photo) n'est exposée.
     */
    public function carte()
    {
        return response()->json(
            Signalement::query()
                ->whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->latest()
                ->limit(500)
                ->get(['id', 'latitude', 'longitude', 'statut', 'categorie', 'commune'])
                ->map(fn ($s) => [
                    'id' => $s->id,
                    'latitude' => (float) $s->latitude,
                    'longitude' => (float) $s->longitude,
                    'statut' => $s->statut,
                    'categorie' => $s->categorie,
                    'commune' => $s->commune,
                ])
        );
    }

    private function tauxResolution(): int
    {
        $total = Signalement::count();

        return $total === 0
            ? 0
            : (int) round(Signalement::where('statut', 'resolu')->count() / $total * 100);
    }

    /**
     * Délai moyen (en jours) entre la création d'un signalement et sa résolution.
     * La date de résolution correspond à la dernière mise à jour d'un signalement résolu.
     */
    private function delaiMoyenResolution(): ?float
    {
        // La fin de la collecte (quand elle existe) date la résolution : elle ne bouge pas
        // si le signalement est modifié plus tard (correction de texte, etc.).
        $delais = Signalement::where('statut', 'resolu')
            ->with('collecte')
            ->get()
            ->map(function ($signalement) {
                $fin = $signalement->collecte && $signalement->collecte->statut === 'terminee'
                    ? $signalement->collecte->updated_at
                    : $signalement->updated_at;

                return $signalement->created_at->diffInHours($fin) / 24;
            });

        return $delais->isEmpty() ? null : round($delais->avg(), 1);
    }

    private function evolutionMensuelle(): array
    {
        $debut = Carbon::now()->startOfMonth()->subMonths(5);

        $comptesParMois = Signalement::select('created_at')
            ->where('created_at', '>=', $debut)
            ->get()
            ->groupBy(fn ($signalement) => $signalement->created_at->format('Y-m'))
            ->map->count();

        $collectesParMois = Collecte::where('statut', 'terminee')
            ->where('updated_at', '>=', $debut)
            ->get(['updated_at'])
            ->groupBy(fn ($collecte) => $collecte->updated_at->format('Y-m'))
            ->map->count();

        $moisAbreges = [1 => 'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
        $mois = collect(range(0, 5))->map(fn ($offset) => Carbon::now()->startOfMonth()->subMonths(5 - $offset));

        return $mois->map(fn (Carbon $date) => [
            'mois' => $date->format('Y-m'),
            'label' => $moisAbreges[(int) $date->format('n')].' '.$date->format('y'),
            'total' => $comptesParMois->get($date->format('Y-m'), 0),
            'collectes' => $collectesParMois->get($date->format('Y-m'), 0),
        ])->values()->all();
    }
}
