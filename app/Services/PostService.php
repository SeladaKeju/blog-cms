<?php

namespace App\Services;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class PostService
{
    /**
     * Get filtered published posts for dashboard
     */
    public function getPublishedPostsForDashboard(array $filters): array
    {
        $query = Post::where('status', 'published');

        // Apply search filter
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'LIKE', "%{$filters['search']}%")
                  ->orWhere('excerpt', 'LIKE', "%{$filters['search']}%")
                  ->orWhere('content', 'LIKE', "%{$filters['search']}%");
            });
        }

        // Apply date range filter
        if (!empty($filters['date_range'])) {
            $this->applyDateRangeFilter($query, $filters['date_range']);
        }

        // Apply sorting
        $this->applySorting($query, $filters['sort'] ?? 'published_at', $filters['order'] ?? 'desc', ['published_at', 'created_at', 'title']);

        return $query->limit(10)->get()->map(function ($post) {
            return $this->transformPostForDashboard($post);
        })->toArray();
    }

    /**
     * Get filtered posts for article management
     */
    public function getPostsForManagement(array $filters): array
    {
        $query = Post::query();

        // Apply search filter
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'LIKE', "%{$filters['search']}%")
                  ->orWhere('excerpt', 'LIKE', "%{$filters['search']}%")
                  ->orWhere('content', 'LIKE', "%{$filters['search']}%");
            });
        }

        // Apply status filter
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Apply sorting
        $this->applySorting($query, $filters['sort'] ?? 'created_at', $filters['order'] ?? 'desc', ['created_at', 'updated_at', 'title']);

        return $query->get()->map(function ($post) {
            return $this->transformPostForManagement($post);
        })->toArray();
    }

    /**
     * Create a new post
     */
    public function createPost(array $data): Post
    {
        // Generate unique slug
        $data['slug'] = $this->generateUniqueSlug($data['title']);

        // Handle thumbnail upload
        if (isset($data['thumbnail'])) {
            $data['thumbnail'] = $this->uploadThumbnail($data['thumbnail']);
        }

        // Set published_at if status is published
        if ($data['status'] === Post::STATUS_PUBLISHED && !isset($data['published_at'])) {
            $data['published_at'] = now();
        }

        return Post::create($data);
    }

    /**
     * Update an existing post
     */
    public function updatePost(Post $post, array $data): Post
    {
        // Update slug if title changed
        if ($data['title'] !== $post->title) {
            $data['slug'] = $this->generateUniqueSlug($data['title'], $post->id);
        }

        // Handle thumbnail upload
        if (isset($data['thumbnail'])) {
            // Delete old thumbnail
            if ($post->thumbnail) {
                $this->deleteThumbnail($post->thumbnail);
            }
            $data['thumbnail'] = $this->uploadThumbnail($data['thumbnail']);
        }

        // Set published_at when status changes to published
        if ($data['status'] === Post::STATUS_PUBLISHED && 
            $post->status !== Post::STATUS_PUBLISHED && 
            !$data['published_at']) {
            $data['published_at'] = now();
        }

        $post->update($data);
        return $post;
    }

    /**
     * Delete a post
     */
    public function deletePost(Post $post): bool
    {
        // Delete thumbnail if exists
        if ($post->thumbnail) {
            $this->deleteThumbnail($post->thumbnail);
        }

        return $post->delete();
    }

    /**
     * Generate unique slug
     */
    public function generateUniqueSlug(string $title, ?int $excludeId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        $query = Post::where('slug', $slug);
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        while ($query->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
            $query = Post::where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
        }

        return $slug;
    }

    /**
     * Apply date range filter to query
     */
    private function applyDateRangeFilter($query, string $dateRange): void
    {
        switch ($dateRange) {
            case 'today':
                $query->whereDate('published_at', today());
                break;
            case 'week':
                $query->whereBetween('published_at', [now()->startOfWeek(), now()->endOfWeek()]);
                break;
            case 'month':
                $query->whereMonth('published_at', now()->month)
                      ->whereYear('published_at', now()->year);
                break;
            case 'year':
                $query->whereYear('published_at', now()->year);
                break;
        }
    }

    /**
     * Apply sorting to query
     */
    private function applySorting($query, string $sortBy, string $sortOrder, array $allowedSorts): void
    {
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy($allowedSorts[0], 'desc');
        }
    }

    /**
     * Transform post for dashboard display
     */
    private function transformPostForDashboard(Post $post): array
    {
        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'thumbnail' => $post->thumbnail ? asset('storage/' . $post->thumbnail) : null,
            'status' => $post->status,
            'published_date' => $post->published_at ? $post->published_at->format('F j, Y') : null,
            'published_at' => $post->published_at?->format('Y-m-d H:i:s'),
            'created_at' => $post->created_at->format('F j, Y'),
            'updated_at' => $post->updated_at->format('F j, Y'),
        ];
    }

    /**
     * Transform post for management display
     */
    private function transformPostForManagement(Post $post): array
    {
        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'content' => $post->content,
            'thumbnail' => $post->thumbnail ? asset('storage/' . $post->thumbnail) : null,
            'status' => $post->status,
            'published_date' => $post->published_at ? $post->published_at->format('F j, Y') : 'Draft',
            'published_at' => $post->published_at?->format('Y-m-d H:i:s'),
            'is_published' => $post->status === 'published',
            'created_at' => $post->created_at->format('F j, Y'),
            'updated_at' => $post->updated_at->format('F j, Y'),
        ];
    }

    /**
     * Transform post for editing
     */
    public function transformPostForEdit(Post $post): array
    {
        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'content' => $post->content,
            'thumbnail' => $post->thumbnail ? asset('storage/' . $post->thumbnail) : null,
            'status' => $post->status,
            'published_at' => $post->published_at?->format('Y-m-d\TH:i'),
            'created_at' => $post->created_at->format('F j, Y'),
            'updated_at' => $post->updated_at->format('F j, Y'),
        ];
    }

    /**
     * Upload thumbnail
     */
    private function uploadThumbnail($file): string
    {
        return $file->store('thumbnails', 'public');
    }

    /**
     * Delete thumbnail
     */
    private function deleteThumbnail(string $path): bool
    {
        return Storage::disk('public')->delete($path);
    }
}