<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance as Middleware;

class PreventRequestsDuringMaintenance extends Middleware
{
    /**
     * URI qui restent accessibles lorsque le mode maintenance est activé.
     *
     * @var array<int, string>
     */
    protected $except = [
        //
    ];
}
