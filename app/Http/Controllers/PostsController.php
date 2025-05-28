<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PostsController extends Controller
{
    /**
     * Display a listing of the posts.
     */
    public function index(Request $request)
    {
        try {
            $query = Post::query();

            // Search functionality
            if ($request->filled('search')) {
                $searchTerm = $request->get('search');
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('title', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('excerpt', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('content', 'LIKE', "%{$searchTerm}%");
                });
            }

            // Status filter
            if ($request->filled('status')) {
                $query->where('status', $request->get('status'));
            }

            // Sort by
            $sortBy = $request->get('sort', 'created_at');
            $sortOrder = $request->get('order', 'desc');
            
            $allowedSorts = ['created_at', 'updated_at', 'title'];
            if (in_array($sortBy, $allowedSorts)) {
                $query->orderBy($sortBy, $sortOrder);
            } else {
                $query->orderBy('created_at', 'desc');
            }

            $posts = $query->get()->map(function ($post) {
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
            });
            
            return Inertia::render('article-management/article-manager', [
                'posts' => $posts->toArray(),
                'filters' => [
                    'search' => $request->get('search', ''),
                    'status' => $request->get('status', ''),
                    'sort' => $request->get('sort', 'created_at'),
                    'order' => $request->get('order', 'desc'),
                ]
            ]);

        } catch (\Exception $e) {
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
    }

    /**
     * Show the form for creating a new post.
     */
    public function create()
    {
        return Inertia::render('article-management/PostCreate');
    }

    /**
     * Store a newly created post in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
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
        ]);

        // Generate unique slug from title
        $validated['slug'] = $this->generateUniqueSlug($validated['title']);

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            $validated['thumbnail'] = $path;
        }

        // Set status based on published_at
        if ($validated['status'] === Post::STATUS_PUBLISHED && !isset($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $post = Post::create($validated);

        return redirect()->route('article')->with('success', 'Post created successfully.');
    }

    /**
     * Show the form for editing the specified post.
     */
    public function edit($id)
    {
        try {
            $post = Post::findOrFail($id);
            
            return Inertia::render('article-management/PostEdit', [
                'post' => [
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
                ]
            ]);
        } catch (\Exception $e) {
            return redirect()->route('article')->with('error', 'Post not found');
        }
    }

    /**
     * Update the specified post in storage.
     */
    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        try {
            $validated = $request->validate([
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
            ]);

            // Update slug if title has changed
            if ($validated['title'] !== $post->title) {
                $validated['slug'] = $this->generateUniqueSlug($validated['title'], $post->id);
            }

            if ($request->hasFile('thumbnail')) {
                // Delete old thumbnail if exists
                if ($post->thumbnail) {
                    Storage::disk('public')->delete($post->thumbnail);
                }
                $path = $request->file('thumbnail')->store('thumbnails', 'public');
                $validated['thumbnail'] = $path;
            }

            // Set published_at when status changes to published
            if ($validated['status'] === Post::STATUS_PUBLISHED && 
                $post->status !== Post::STATUS_PUBLISHED && 
                !$validated['published_at']) {
                $validated['published_at'] = now();
            }

            $post->update($validated);
    

            return redirect()->route('article')->with('success', 'Post updated successfully.');

        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update post: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified post from storage.
     */
    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        
        // Delete thumbnail if exists
        if ($post->thumbnail) {
            Storage::disk('public')->delete($post->thumbnail);
        }

        $post->delete();

        return redirect()->route('article')->with('success', 'Post deleted successfully.');
    }

    /**
     * Generate a unique slug
     */
    private function generateUniqueSlug($title, $excludeId = null)
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
}
