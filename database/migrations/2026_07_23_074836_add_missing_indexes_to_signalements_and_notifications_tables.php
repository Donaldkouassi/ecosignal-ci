<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('signalements', function (Blueprint $table) {
            $table->index('statut');
            $table->index('commune');
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->index(['user_id', 'lue']);
        });
    }

    public function down(): void
    {
        Schema::table('signalements', function (Blueprint $table) {
            $table->dropIndex(['statut']);
            $table->dropIndex(['commune']);
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'lue']);
        });
    }
};
