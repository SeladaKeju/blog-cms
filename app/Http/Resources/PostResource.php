<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'thumbnail' => $this->thumbnail ? asset('storage/' . $this->thumbnail) : null,
            'status' => $this->status,
            'published_date' => $this->published_at ? $this->published_at->format('F j, Y') : 'Draft',
            'published_at' => $this->published_at?->format('Y-m-d H:i:s'),
            'is_published' => $this->status === 'published',
            'created_at' => $this->created_at->format('F j, Y'),
            'updated_at' => $this->updated_at->format('F j, Y'),
        ];
    }
}