<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('collectes')) {
            Schema::create('collectes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('signalement_id')->unique()->constrained()->onDelete('cascade');
                $table->date('date_passage');
                $table->string('equipe_assignee');
                $table->enum('statut', ['planifiee', 'terminee'])->default('planifiee');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('collectes');
    }
};