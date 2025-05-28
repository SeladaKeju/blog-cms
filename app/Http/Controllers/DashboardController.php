<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Statistics
            $stats = [
                'total_articles' => Post::count(),
                'published_articles' => Post::where('status', 'published')->count(),
                'draft_articles' => Post::where('status', 'draft')->count(),
            ];

            // Query for published articles
            $query = Post::where('status', 'published');

            // Search functionality
            if ($request->filled('search')) {
                $searchTerm = $request->get('search');
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('title', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('excerpt', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('content', 'LIKE', "%{$searchTerm}%");
                });
            }

            // Date filter
            if ($request->filled('date_range')) {
                $dateRange = $request->get('date_range');
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

            // Sort by
            $sortBy = $request->get('sort', 'published_at');
            $sortOrder = $request->get('order', 'desc');
            
            $allowedSorts = ['published_at', 'created_at', 'title'];
            if (in_array($sortBy, $allowedSorts)) {
                $query->orderBy($sortBy, $sortOrder);
            } else {
                $query->orderBy('published_at', 'desc');
            }

            // Limit results for dashboard
            $posts = $query->limit(10)->get()->map(function ($post) {
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
            });
            
            return Inertia::render('Dashboard', [
                'stats' => $stats,
                'posts' => $posts->toArray(),
                'filters' => [
                    'search' => $request->get('search', ''),
                    'date_range' => $request->get('date_range', ''),
                    'sort' => $request->get('sort', 'published_at'),
                    'order' => $request->get('order', 'desc'),
                ]
            ]);

        } catch (\Exception $e) {
            return Inertia::render('Dashboard', [
                'stats' => [
                    'total_articles' => 0,
                    'published_articles' => 0,
                    'draft_articles' => 0,
                ],
                'posts' => [],
                'filters' => [
                    'search' => '',
                    'date_range' => '',
                    'sort' => 'published_at',
                    'order' => 'desc',
                ],
                'error' => $e->getMessage()
            ]);
        }
    }
}