<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostsController extends Controller
{
    /**
     * Display a listing of the posts.
     */
    public function index()
    {
        $posts = Post::orderBy('created_at', 'desc')
            ->get()
            ->map(function ($post) {
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
                    'is_published' => $post->isPublished(),
                    'created_at' => $post->created_at->format('F j, Y'),
                    'updated_at' => $post->updated_at->format('F j, Y'),
                ];
            });
        
        return Inertia::render('article-management/article-manager', [
            'posts' => $posts->toArray()
        ]);
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
    public function update(Request $request, Post $post)
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

        // Update slug if title has changed
        if ($validated['title'] !== $post->title) {
            $validated['slug'] = $this->generateUniqueSlug($validated['title'], $post->id);
        }

        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail if exists
            if ($post->thumbnail) {
                \Storage::disk('public')->delete($post->thumbnail);
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
    }

    /**
     * Remove the specified post from storage.
     */
    public function destroy(Post $post)
    {
        // Delete thumbnail if exists
        if ($post->thumbnail) {
            \Storage::disk('public')->delete($post->thumbnail);
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
