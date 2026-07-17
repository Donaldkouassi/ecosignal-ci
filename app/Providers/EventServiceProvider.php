<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * Correspondances entre les événements et leurs écouteurs.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];

    /**
     * Enregistre les événements de l’application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Indique si les événements et écouteurs doivent être découverts automatiquement.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
