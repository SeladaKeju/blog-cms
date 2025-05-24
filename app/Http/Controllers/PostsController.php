<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
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
                    'excerpt' => $post->excerpt,
                    'content' => $post->content,
                    'thumbnail' => $post->thumbnail,
                    'status' => $post->status,
                    'published_date' => $post->published_date,
                    'is_published' => $post->isPublished(),
                ];
            });
        
        return Inertia::render('article-management/article-manager', [
            'posts' => $posts
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

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            $validated['thumbnail'] = $path;
        }

        // Set status based on published_at
        if ($validated['status'] === Post::STATUS_PUBLISHED && !isset($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        Post::create($validated);

        return redirect()->route('article')->with('success', 'Post created successfully.');
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
            $post->status !== Post::STATUS_PUBLISHED) {
            $validated['published_at'] = now();
        }

        $post->update($validated);

        return redirect()->back()->with('success', 'Post updated successfully.');
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

        return redirect()->back()->with('success', 'Post deleted successfully.');
    }

    /**
     * Show the form for editing the specified post.
     */
}
