<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\EditorApplication;
use App\Models\Post;
use App\Models\Bookmark;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Schema;

class UserController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Get dashboard data based on user role
     */
    public function dashboard()
    {
        $user = auth()->user();
        
        // Get data berdasarkan role
        $dashboardData = $this->getDashboardData($user);
        
        return Inertia::render('Dashboard', $dashboardData);
    }

    private function getDashboardData($user)
    {
        $baseData = [
            'user' => $user->load('roles'),
            'userRole' => $user->getRoleNames()->first(), // Get primary role
            'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
        ];

        // Role-specific data
        switch (true) {
            case $user->hasRole('admin'):
                return array_merge($baseData, $this->getAdminData());
            
            case $user->hasRole('editor'):
                return array_merge($baseData, $this->getEditorData($user));
            
            case $user->hasRole('viewer'):
                return array_merge($baseData, $this->getViewerData($user));
            
            default:
                return $baseData;
        }
    }

    private function getAdminData()
    {
        return [
            'stats' => [
                'total_users' => User::count(),
                'total_editors' => User::role('editor')->count(),
                'total_viewers' => User::role('viewer')->count(),
                'pending_applications' => EditorApplication::pending()->count(),
                'total_posts' => Post::count(),
                'published_posts' => Post::where('status', Post::STATUS_PUBLISHED)->count(),
                'pending_posts' => Post::where('status', Post::STATUS_PENDING_REVIEW)->count(),
                'draft_posts' => Post::where('status', Post::STATUS_DRAFT)->count(),
            ],
            'recentApplications' => EditorApplication::with(['user'])
                ->pending()
                ->recentFirst()
                ->limit(5)
                ->get(),
            'pendingPosts' => Post::with(['author'])
                ->where('status', Post::STATUS_PENDING_REVIEW)
                ->latest()
                ->limit(5)
                ->get(),
            'posts' => Post::published()
                ->with('author')
                ->latest()
                ->limit(10)
                ->get(),
        ];
    }

    private function getEditorData($user)
    {
        // Safe stats calculation with fallbacks
        $stats = [
            'total_posts' => 0,
            'published_posts' => 0,
            'draft_posts' => 0,
            'pending_posts' => 0,
            'rejected_posts' => 0,
            'total_bookmarks' => $user->bookmarks()->count(),
        ];

        // Only calculate post stats if author_id column exists
        try {
            if (Schema::hasColumn('posts', 'author_id')) {
                $stats['total_posts'] = $user->posts()->count();
                $stats['published_posts'] = $user->posts()->where('status', 'published')->count();
                $stats['draft_posts'] = $user->posts()->where('status', 'draft')->count();
                
                // Only check these statuses if they exist in enum
                if (Schema::hasColumn('posts', 'status')) {
                    $stats['pending_posts'] = $user->posts()->where('status', 'pending_review')->count();
                    $stats['rejected_posts'] = $user->posts()->where('status', 'rejected')->count();
                }
            }
        } catch (\Exception $e) {
            // Keep default values if any error
            \Log::warning('Error calculating post stats for user ' . $user->id . ': ' . $e->getMessage());
        }

        // Safe posts loading
        $posts = collect(); // Empty collection as fallback
        try {
            if (Schema::hasColumn('posts', 'author_id')) {
                $posts = $user->posts()
                    ->latest()
                    ->limit(10)
                    ->get();
            }
        } catch (\Exception $e) {
            \Log::warning('Error loading posts for user ' . $user->id . ': ' . $e->getMessage());
        }

        // Safe bookmarks loading
        $recentBookmarks = collect();
        try {
            $recentBookmarks = $user->bookmarks()
                ->with('post.author')
                ->latest()
                ->limit(5)
                ->get();
        } catch (\Exception $e) {
            \Log::warning('Error loading bookmarks for user ' . $user->id . ': ' . $e->getMessage());
        }

        return [
            'stats' => $stats,
            'posts' => $posts,
            'recentBookmarks' => $recentBookmarks,
        ];
    }

    private function getViewerData($user)
    {
        $applicationStatus = EditorApplication::byUser($user->id)->latest()->first();
        
        return [
            'stats' => [
                'total_bookmarks' => $user->bookmarks()->count(),
                'recent_bookmarks' => $user->bookmarks()->where('created_at', '>=', now()->subDays(7))->count(),
            ],
            'posts' => Post::published()
                ->with('author')
                ->latest()
                ->limit(10)
                ->get(),
            'recentBookmarks' => $user->bookmarks()
                ->withPost()
                ->with('post.author')
                ->recent()
                ->limit(5)
                ->get(),
            'applicationStatus' => $applicationStatus,
            'canApplyEditor' => !$user->hasEditorApplication() || 
                              ($applicationStatus && $applicationStatus->isRejected()),
        ];
    }

    /**
     * Display a listing of users (Admin only)
     */
    public function index()
    {
        if (!auth()->user()->can('manage-users')) {
            abort(403, 'Unauthorized');
        }

        $users = User::with('roles')
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new user
     */
    public function create()
    {
        if (!auth()->user()->can('manage-users')) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Admin/Users/Create');
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        if (!auth()->user()->can('manage-users')) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:admin,editor,viewer',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'email_verified_at' => now(),
        ]);

        $user->assignRole($request->role);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully!');
    }

    /**
     * Display the specified user
     */
    public function show(User $user)
    {
        if (!auth()->user()->can('manage-users')) {
            abort(403, 'Unauthorized');
        }

        $user->load(['roles', 'posts', 'editorApplications', 'bookmarks.post']);

        return Inertia::render('Admin/Users/Show', [
            'user' => $user
        ]);
    }

    /**
     * Update the specified user
     */
    public function updateUser(Request $request, User $user)
    {
        if (!auth()->user()->can('manage-users')) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => 'required|string|in:admin,editor,viewer',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);
        $user->syncRoles([$request->role]);

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully!');
    }

    /**
     * Remove the specified user
     */
    public function destroyUser(User $user)
    {
        if (!auth()->user()->can('manage-users')) {
            abort(403, 'Unauthorized');
        }

        // Prevent deleting own account
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully!');
    }
}