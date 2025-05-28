<?php

namespace App\Http\Requests;

use App\Models\Post;
use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|max:255',
            'excerpt' => 'required',
            'content' => 'required',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:' . implode(',', [
                Post::STATUS_DRAFT,
                Post::STATUS_PUBLISHED,
                Post::STATUS_ARCHIVED
            ]),
            'published_at' => 'nullable|date'
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Title is required',
            'excerpt.required' => 'Excerpt is required',
            'content.required' => 'Content is required',
            'status.in' => 'Invalid status selected',
            'thumbnail.image' => 'Thumbnail must be an image',
            'thumbnail.max' => 'Thumbnail size must not exceed 2MB',
        ];
    }
}