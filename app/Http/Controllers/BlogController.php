<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    /**
     * Display blog landing page with all published posts
     */
    public function index(Request $request)
    {
        try {
            $query = Post::with('author')->where('status', 'published')->whereNotNull('published_at');

            // Search functionality
            if ($request->filled('search')) {
                $searchTerm = $request->get('search');
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('title', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('excerpt', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('content', 'LIKE', "%{$searchTerm}%");
                });
            }

            // Category filter (if you have categories in future)
            if ($request->filled('category')) {
                $query->where('category', $request->get('category'));
            }

            // Sort by published date (newest first)
            $query->orderBy('published_at', 'desc');

            // Paginate results
            $posts = $query->paginate(12)->through(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'thumbnail' => $post->thumbnail ? asset('storage/' . $post->thumbnail) : null,
                    'published_date' => $post->published_at->format('F j, Y'),
                    'published_at' => $post->published_at->format('Y-m-d H:i:s'),
                    'reading_time' => $this->calculateReadingTime($post->content),
                    'author' => $post->author ? $post->author->name : 'Unknown',
                ];
            });

            // Get recent posts for sidebar
            $recentPosts = Post::where('status', 'published')
                ->whereNotNull('published_at')
                ->orderBy('published_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($post) {
                    return [
                        'id' => $post->id,
                        'title' => $post->title,
                        'slug' => $post->slug,
                        'published_date' => $post->published_at->format('M j, Y'),
                        'thumbnail' => $post->thumbnail ? asset('storage/' . $post->thumbnail) : null,
                    ];
                });

            return Inertia::render('blog/Index', [
                'posts' => $posts,
                'recentPosts' => $recentPosts,
                'filters' => [
                    'search' => $request->get('search', ''),
                    'category' => $request->get('category', ''),
                ],
                'auth' => [
                    'user' => auth()->user(),
                    'userRole' => auth()->user()?->getRoleNames()->first(),
                    'canBookmark' => auth()->check(),
                    'canApplyEditor' => auth()->check(),
                ]
            ]);

        } catch (\Exception $e) {
            return Inertia::render('blog/Index', [
                'posts' => collect(),
                'recentPosts' => collect(),
                'filters' => ['search' => '', 'category' => ''],
                'auth' => [
                    'user' => null,
                    'userRole' => null,
                    'canBookmark' => false,
                    'canApplyEditor' => false,
                ],
                'error' => 'Failed to load blog posts'
            ]);
        }
    }

    /**
     * Display single blog post
     */
    public function show($slug)
    {
        try {
            $post = Post::with('author')
                ->where('slug', $slug)
                ->where('status', 'published')
                ->whereNotNull('published_at')
                ->firstOrFail();

            // Get related posts
            $relatedPosts = Post::where('status', 'published')
                ->whereNotNull('published_at')
                ->where('id', '!=', $post->id)
                ->orderBy('published_at', 'desc')
                ->limit(3)
                ->get()
                ->map(function ($relatedPost) {
                    return [
                        'id' => $relatedPost->id,
                        'title' => $relatedPost->title,
                        'slug' => $relatedPost->slug,
                        'excerpt' => $relatedPost->excerpt,
                        'thumbnail' => $relatedPost->thumbnail ? asset('storage/' . $relatedPost->thumbnail) : null,
                        'published_date' => $relatedPost->published_at->format('F j, Y'),
                    ];
                });

            return Inertia::render('blog/Show', [
                'post' => [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'content' => $post->content,
                    'thumbnail' => $post->thumbnail ? asset('storage/' . $post->thumbnail) : null,
                    'published_date' => $post->published_at->format('F j, Y'),
                    'published_at' => $post->published_at->format('Y-m-d H:i:s'),
                    'reading_time' => $this->calculateReadingTime($post->content),
                    'author' => $post->author ? $post->author->name : 'Unknown',
                ],
                'relatedPosts' => $relatedPosts,
                'auth' => [
                    'user' => auth()->user(),
                    'userRole' => auth()->user()?->getRoleNames()->first(),
                    'canBookmark' => auth()->check(),
                    'canApplyEditor' => auth()->check(),
                ]
            ]);

        } catch (\Exception $e) {
            abort(404, 'Post not found');
        }
    }

    /**
     * Calculate reading time based on content
     */
    private function calculateReadingTime($content)
    {
        $wordCount = str_word_count(strip_tags($content));
        $wordsPerMinute = 200; // Average reading speed
        $minutes = ceil($wordCount / $wordsPerMinute);
        
        return $minutes . ' min read';
    }
}