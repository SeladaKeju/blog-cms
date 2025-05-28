<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Services\PostService;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PostsController extends Controller
{
    public function __construct(
        private PostService $postService
    ) {}

    /**
     * Display dashboard with statistics and recent published posts
     */
    public function dashboard(Request $request): Response
    {
        try {
            $filters = $this->extractDashboardFilters($request);
            
            $stats = $this->postService->getDashboardStats();
            $posts = $this->postService->getPublishedPostsForDashboard($filters);
            
            return Inertia::render('Dashboard', [
                'stats' => $stats,
                'posts' => $posts,
                'filters' => $filters
            ]);

        } catch (\Exception $e) {
            return $this->handleDashboardError($e);
        }
    }

    /**
     * Display a listing of posts for management
     */
    public function index(Request $request): Response
    {
        try {
            $filters = $this->extractManagementFilters($request);
            $posts = $this->postService->getPostsForManagement($filters);
            
            return Inertia::render('article-management/article-manager', [
                'posts' => $posts,
                'filters' => $filters
            ]);

        } catch (\Exception $e) {
            return $this->handleManagementError($e);
        }
    }

    /**
     * Show the form for creating a new post
     */
    public function create(): Response
    {
        return Inertia::render('article-management/PostCreate');
    }

    /**
     * Store a newly created post
     */
    public function store(StorePostRequest $request): RedirectResponse
    {
        try {
            $this->postService->createPost($request->validated());
            
            return redirect()
                ->route('article')
                ->with('success', 'Post created successfully.');

        } catch (\Exception $e) {
            return back()
                ->with('error', 'Failed to create post: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified post
     */
    public function edit(int $id): Response|RedirectResponse
    {
        try {
            $post = Post::findOrFail($id);
            $transformedPost = $this->postService->transformPostForEdit($post);
            
            return Inertia::render('article-management/PostEdit', [
                'post' => $transformedPost
            ]);

        } catch (\Exception $e) {
            return redirect()
                ->route('article')
                ->with('error', 'Post not found');
        }
    }

    /**
     * Update the specified post
     */
    public function update(UpdatePostRequest $request, int $id): RedirectResponse
    {
        try {
            $post = Post::findOrFail($id);
            $this->postService->updatePost($post, $request->validated());

            return redirect()
                ->route('article')
                ->with('success', 'Post updated successfully.');

        } catch (\Exception $e) {
            return back()
                ->with('error', 'Failed to update post: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified post from storage
     */
    public function destroy(int $id): RedirectResponse
    {
        try {
            $post = Post::findOrFail($id);
            $this->postService->deletePost($post);

            return redirect()
                ->route('article')
                ->with('success', 'Post deleted successfully.');

        } catch (\Exception $e) {
            return back()
                ->with('error', 'Failed to delete post: ' . $e->getMessage());
        }
    }

    /**
     * Extract dashboard filters from request
     */
    private function extractDashboardFilters(Request $request): array
    {
        return [
            'search' => $request->get('search', ''),
            'date_range' => $request->get('date_range', ''),
            'sort' => $request->get('sort', 'published_at'),
            'order' => $request->get('order', 'desc'),
        ];
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
     * Handle dashboard errors
     */
    private function handleDashboardError(\Exception $e): Response
    {
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
}
