<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Retourne le chemin de redirection lorsqu’un utilisateur n’est pas authentifié.
     */
    protected function redirectTo(Request $request): ?string
    {
        return $request->expectsJson() ? null : url('/login');
    }
}
