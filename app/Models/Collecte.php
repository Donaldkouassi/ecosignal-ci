<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collecte extends Model
{
    use HasFactory;

    protected $fillable = [
        'signalement_id',
        'date_passage',
        'equipe_assignee',
        'statut',
    ];

    // Relation
    public function signalement()
    {
        return $this->belongsTo(Signalement::class);
    }
}