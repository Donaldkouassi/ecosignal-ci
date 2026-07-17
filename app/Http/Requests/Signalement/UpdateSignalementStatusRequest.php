<?php

namespace App\Http\Requests\Signalement;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSignalementStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'statut' => ['required', 'string', 'in:en_attente,en_cours,resolu'],
        ];
    }
}
