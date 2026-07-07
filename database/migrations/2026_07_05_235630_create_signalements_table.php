<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('signalements')) {
            Schema::create('signalements', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('photo_path')->nullable();
                $table->text('description');
                $table->enum('categorie', ['plastique', 'organique', 'encombrant', 'mixte', 'autre']);
                $table->string('commune');
                $table->decimal('latitude', 10, 7)->nullable();
                $table->decimal('longitude', 10, 7)->nullable();
                $table->enum('statut', ['en_attente', 'en_cours', 'resolu'])->default('en_attente');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('signalements');
    }
};