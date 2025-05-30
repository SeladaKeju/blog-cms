<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Services\PostService;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PostsController extends Controller
{
    public function __construct(
        private PostService $postService
    ) {}

    /**
     * Display a listing of posts based on user role
     */
    public function index(Request $request): Response
    {
        try {
            $user = Auth::user();
            $filters = $this->extractManagementFilters($request);

            if ($user->hasRole('admin')) {
                // Admin sees all posts
                $posts = $this->postService->getPostsForManagement($filters);
            } else {
                // Editor sees only their posts
                $filters['author_id'] = $user->id;
                $posts = $this->postService->getPostsForManagement($filters);
            }
            
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
            
            $this->postService->createPost($data);
            
            return redirect()
                ->route('posts.index')
                ->with('success', 'Post created successfully.');

        } catch (\Exception $e) {
            return back()
                ->with('error', 'Failed to create post: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified post
     */
    public function show(Post $post): Response
    {
        $user = Auth::user();
        
        // Admin can see all posts, editor can see own posts
        if (!$user->hasRole('admin') && $post->author_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $post->load(['author', 'approver']);

        return Inertia::render('Posts/Show', [
            'post' => $post
        ]);
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

            $transformedPost = $this->postService->transformPostForEdit($post);
            
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

            $this->postService->updatePost($post, $request->validated());

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

            $this->postService->deletePost($post);

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
     * Get pending posts for admin review
     */
    public function pending(): Response
    {
        if (!Auth::user()->can('approve-posts')) {
            abort(403, 'Unauthorized');
        }

        $posts = Post::with(['author'])
            ->pendingReview()
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Posts/Pending', [
            'posts' => $posts
        ]);
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
}