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
     * Display a listing of bookmarked posts.
     */
    public function index()
    {
        // Tambahkan log debugging
        \Log::info('Bookmarks page requested');
        \Log::info('User ID: ' . Auth::id());
        
        $bookmarks = Bookmark::where('user_id', Auth::id())
            ->with(['post' => function($query) {
                $query->with('author');
            }])
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        \Log::info('Bookmarks count: ' . $bookmarks->count());

        return Inertia::render('blog/Bookmarks', [  // Sesuai dengan struktur folder yang benar
            'bookmarks' => $bookmarks,
            'auth' => [
                'user' => auth()->user(),
                'userRole' => auth()->user()?->getRoleNames()->first()
            ]
        ]);
    }

    /**
     * Toggle bookmark status for a post
     */
    public function toggle($postId)
    {
        try {
            $user = Auth::user();
            
            // Cari post berdasarkan ID secara manual
            $post = Post::findOrFail($postId);
            
            // Debugging
            \Log::info('Toggle bookmark for post ID: ' . $post->id . ' by user ID: ' . $user->id);
            
            // Check if bookmark exists
            $bookmark = Bookmark::where('user_id', $user->id)
                ->where('post_id', $post->id)
                ->first();
                
            if ($bookmark) {
                // If bookmark exists, delete it (remove bookmark)
                $bookmark->delete();
                \Log::info('Bookmark removed successfully');
                
                return response()->json([
                    'message' => 'Article removed from bookmarks',
                    'bookmarked' => false
                ]);
            } else {
                // If bookmark doesn't exist, create it (add bookmark)
                Bookmark::create([
                    'user_id' => $user->id,
                    'post_id' => $post->id
                ]);
                \Log::info('Bookmark added successfully');
                
                return response()->json([
                    'message' => 'Article added to bookmarks',
                    'bookmarked' => true
                ]);
            }
        } catch (\Exception $e) {
            // Log detailed error
            \Log::error('Bookmark toggle error: ' . $e->getMessage());
            \Log::error('Error trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'error' => 'Failed to update bookmark: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if a post is bookmarked by the current user
     */
    public function check($postId)
    {
        try {
            $bookmarked = false;
            
            if (Auth::check()) {
                // Cari post berdasarkan ID secara manual
                $post = Post::findOrFail($postId);
                
                $bookmarked = Bookmark::where('user_id', Auth::id())
                    ->where('post_id', $post->id)
                    ->exists();
            }
            
            return response()->json([
                'bookmarked' => $bookmarked
            ]);
        } catch (\Exception $e) {
            \Log::error('Bookmark check error: ' . $e->getMessage());
            return response()->json([
                'bookmarked' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Remove a specific bookmark
     */
    public function destroy(Bookmark $bookmark)
    {
        // Security check - only allow users to delete their own bookmarks
        if ($bookmark->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $bookmark->delete();
        
        return response()->json([
            'message' => 'Bookmark removed successfully'
        ]);
    }
}
