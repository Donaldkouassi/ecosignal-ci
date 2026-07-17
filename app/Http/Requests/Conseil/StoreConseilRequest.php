<?php

namespace App\Http\Requests\Conseil;

use Illuminate\Foundation\Http\FormRequest;

class StoreConseilRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'titre' => ['required', 'string', 'max:255'],
            'contenu' => ['required', 'string', 'min:10'],
            'categorie' => ['required', 'string', 'max:100'],
            'image_path' => ['nullable', 'string', 'max:255'],
        ];
    }
}
