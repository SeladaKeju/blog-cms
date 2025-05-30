<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookmarkController extends Controller
{
    /**
     * Display user's bookmarks
     */
    public function index()
    {
        // Check permission
        if (!Auth::user()->can('manage-bookmarks')) {
            abort(403, 'Unauthorized');
        }

        $bookmarks = Bookmark::byUser(Auth::id())
            ->withPost()
            ->with('post.author')
            ->recent()
            ->paginate(12);

        return Inertia::render('Bookmarks/Index', [
            'bookmarks' => $bookmarks
        ]);
    }

    /**
     * Toggle bookmark for a post (AJAX)
     */
    public function toggle(Request $request, Post $post)
    {
        // Check permission
        if (!Auth::user()->can('manage-bookmarks')) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Check if post is published
        if (!$post->isPublished()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot bookmark unpublished posts.'
            ], 422);
        }

        $isBookmarked = Bookmark::toggle(Auth::id(), $post->id);

        return response()->json([
            'success' => true,
            'bookmarked' => $isBookmarked,
            'message' => $isBookmarked ? 'Post bookmarked!' : 'Bookmark removed!',
            'bookmark_count' => $post->getBookmarkCount()
        ]);
    }

    /**
     * Remove specific bookmark
     */
    public function destroy(Bookmark $bookmark)
    {
        // Check ownership
        if ($bookmark->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $bookmark->delete();

        return redirect()->back()->with('success', 'Bookmark removed successfully!');
    }

    /**
     * Check if post is bookmarked by user (AJAX)
     */
    public function check(Post $post)
    {
        $isBookmarked = Bookmark::exists(Auth::id(), $post->id);

        return response()->json([
            'bookmarked' => $isBookmarked,
            'bookmark_count' => $post->getBookmarkCount()
        ]);
    }

    /**
     * Get user's recent bookmarks for dashboard
     */
    public function recent(Request $request)
    {
        $limit = $request->get('limit', 5);
        
        $bookmarks = Bookmark::byUser(Auth::id())
            ->withPost()
            ->with('post.author')
            ->recent()
            ->limit($limit)
            ->get();

        return response()->json($bookmarks);
    }
}
