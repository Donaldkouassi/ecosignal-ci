<?php

namespace App\Http\Requests\Signalement;

use Illuminate\Foundation\Http\FormRequest;

class StoreSignalementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'commune' => ['required', 'string', 'max:100'],
            'categorie' => ['required', 'string', 'in:plastique,organique,encombrant,mixte,autre'],
            'description' => ['required', 'string', 'min:10', 'max:2000'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ];
    }
}
