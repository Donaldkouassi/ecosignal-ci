<?php

namespace App\Http\Requests\Collecte;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCollecteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'date_passage' => ['sometimes', 'date'],
            'equipe_assignee' => ['sometimes', 'string', 'max:150'],
            'statut' => ['sometimes', 'in:planifiee,terminee'],
        ];
    }
}
