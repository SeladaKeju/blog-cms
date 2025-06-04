<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class PostsController extends Controller
{
    /**
     * Display a listing of posts based on user role
     */
    public function index(Request $request): Response
    {
        try {
            $user = auth()->user();
            
            // Get posts based on user role
            $query = $user->hasRole('admin') 
                ? Post::with('author') 
                : Post::with('author')->where('author_id', $user->id);
            
            // Get posts with basic filtering
            $posts = $query->latest()->get();
            
            // Debug info
            \Log::info('Posts count: ' . $posts->count());
            \Log::info('Rendering article-manager');
            
            // IMPORTANT: Make sure the path exactly matches the case and path of your component
            return Inertia::render('article-management/article-manager', [
                'posts' => $posts,
                'filters' => [
                    'search' => $request->get('search', ''),
                    'status' => $request->get('status', ''),
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Posts index error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Show the form for creating a new post
     */
    public function create(): Response
    {
        // Check permission
        if (!Auth::user()->can('create-posts')) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('article-management/PostCreate');
    }

    /**
     * Store a newly created post
     */
    public function store(StorePostRequest $request): RedirectResponse
    {
        // Check permission
        if (!Auth::user()->can('create-posts')) {
            abort(403, 'Unauthorized');
        }

        try {
            $data = $request->validated();
            $data['author_id'] = Auth::id(); // Add author
            
            $this->createPost($data);
            
            return redirect()
                ->route('posts.index')
                ->with('success', 'Post created successfully.');

        } catch (\Exception $e) {
            return back()
                ->with('error', 'Failed to create post: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified post
     */
    public function edit(Post $post): Response|RedirectResponse
    {
        try {
            $user = Auth::user();
            
            // Admin can edit all posts, editor can edit own posts
            if (!$user->hasRole('admin') && $post->author_id !== $user->id) {
                abort(403, 'Unauthorized');
            }

            $transformedPost = $this->transformPostForEdit($post);
            
            return Inertia::render('article-management/PostEdit', [
                'post' => $transformedPost
            ]);

        } catch (\Exception $e) {
            return redirect()
                ->route('posts.index')
                ->with('error', 'Post not found');
        }
    }

    /**
     * Update the specified post
     */
    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        try {
            $user = Auth::user();
            
            // Admin can update all posts, editor can update own posts
            if (!$user->hasRole('admin') && $post->author_id !== $user->id) {
                abort(403, 'Unauthorized');
            }

            $this->updatePost($post, $request->validated());

            return redirect()
                ->route('posts.index')
                ->with('success', 'Post updated successfully.');

        } catch (\Exception $e) {
            return back()
                ->with('error', 'Failed to update post: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified post from storage
     */
    public function destroy(Post $post): RedirectResponse
    {
        try {
            $user = Auth::user();
            
            // Admin can delete all posts, editor can delete own posts
            if (!$user->hasRole('admin') && $post->author_id !== $user->id) {
                abort(403, 'Unauthorized');
            }

            $this->deletePost($post);

            return redirect()
                ->route('posts.index')
                ->with('success', 'Post deleted successfully.');

        } catch (\Exception $e) {
            return back()
                ->with('error', 'Failed to delete post: ' . $e->getMessage());
        }
    }

    /**
     * Submit post for review
     */
    public function submitForReview(Post $post): RedirectResponse
    {
        $user = Auth::user();
        
        // Only post author can submit for review
        if ($post->author_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        if (!$post->isDraft()) {
            return redirect()->back()->with('error', 'Only draft posts can be submitted for review.');
        }

        $post->submitForReview();

        return redirect()->back()->with('success', 'Post submitted for review successfully!');
    }

    /**
     * Approve post (Admin only)
     */
    public function approve(Post $post): RedirectResponse
    {
        if (!Auth::user()->can('approve-posts')) {
            abort(403, 'Unauthorized');
        }

        if (!$post->isPendingReview()) {
            return redirect()->back()->with('error', 'Only pending posts can be approved.');
        }

        $post->approve(Auth::id());

        return redirect()->back()->with('success', 'Post approved and published successfully!');
    }

    /**
     * Reject post (Admin only)
     */
    public function reject(Post $post): RedirectResponse
    {
        if (!Auth::user()->can('approve-posts')) {
            abort(403, 'Unauthorized');
        }

        if (!$post->isPendingReview()) {
            return redirect()->back()->with('error', 'Only pending posts can be rejected.');
        }

        $post->reject(Auth::id());

        return redirect()->back()->with('success', 'Post rejected successfully!');
    }


    /**
     * Extract management filters from request
     */
    private function extractManagementFilters(Request $request): array
    {
        return [
            'search' => $request->get('search', ''),
            'status' => $request->get('status', ''),
            'sort' => $request->get('sort', 'created_at'),
            'order' => $request->get('order', 'desc'),
        ];
    }

    /**
     * Handle management errors
     */
    private function handleManagementError(\Exception $e): Response
    {
        return Inertia::render('article-management/article-manager', [
            'posts' => [],
            'filters' => [
                'search' => '',
                'status' => '',
                'sort' => 'created_at',
                'order' => 'desc',
            ],
            'error' => $e->getMessage()
        ]);
    }

    /**
     * Get filtered published posts for dashboard
     */
    private function getPublishedPostsForDashboard(array $filters): array
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
    private function getPostsForManagement(array $filters): array
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
    private function createPost(array $data): Post
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
    private function updatePost(Post $post, array $data): Post
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
            !isset($data['published_at'])) {
            $data['published_at'] = now();
        }

        $post->update($data);
        return $post;
    }

    /**
     * Delete a post
     */
    private function deletePost(Post $post): bool
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
    private function generateUniqueSlug(string $title, ?int $excludeId = null): string
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
    private function transformPostForEdit(Post $post): array
    {
        // Verify post exists
        if (!$post || !$post->id) {
            \Log::error('Invalid post passed to transformPostForEdit', [
                'post' => $post ?? 'null'
            ]);
            throw new \Exception('Invalid post data');
        }
        
        // Log post data for debugging
        \Log::info('Transforming post for edit', [
            'post_id' => $post->id,
            'post_title' => $post->title
        ]);
        
        // Return transformed post
        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'content' => $post->content,
            'excerpt' => $post->excerpt,
            'status' => $post->status,
            'thumbnail' => $post->thumbnail ? asset('storage/' . $post->thumbnail) : null,
            'published_at' => $post->published_at?->format('Y-m-d\TH:i'),
            'author_id' => $post->author_id,
            'created_at' => $post->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $post->updated_at->format('Y-m-d H:i:s'),
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