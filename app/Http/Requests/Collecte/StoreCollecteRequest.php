<?php

namespace App\Http\Requests\Collecte;

use Illuminate\Foundation\Http\FormRequest;

class StoreCollecteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'signalement_id' => ['required', 'integer', 'exists:signalements,id', 'unique:collectes,signalement_id'],
            'date_passage' => ['required', 'date', 'after_or_equal:today'],
            'equipe_assignee' => ['required', 'string', 'max:150'],
        ];
    }
}
