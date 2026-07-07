<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Signalement extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'photo_path',
        'description',
        'categorie',
        'commune',
        'latitude',
        'longitude',
        'statut',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function collecte()
    {
        return $this->hasOne(Collecte::class);
    }
}