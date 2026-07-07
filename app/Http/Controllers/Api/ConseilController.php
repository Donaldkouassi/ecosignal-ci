<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conseil;
use Illuminate\Http\Request;

class ConseilController extends Controller
{
    public function index()
    {
        return response()->json(
            Conseil::latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'contenu' => 'required|string',
            'categorie' => 'required|string|max:100',
            'image_path' => 'nullable|string|max:255',
        ]);

        $conseil = Conseil::create($validated);

        return response()->json($conseil, 201);
    }
}
