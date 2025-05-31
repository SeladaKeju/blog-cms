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
     * Dashboard hanya untuk Admin dan Editor
     */
    public function dashboard()
    {
        $user = Auth::user();
        
        try {
            if ($user->hasRole('admin')) {
                $data = $this->getAdminData();
                return Inertia::render('Dashboard/index', array_merge($data, ['userRole' => 'admin']));
            } elseif ($user->hasRole('editor')) {
                $data = $this->getEditorData();
                return Inertia::render('Dashboard/index', array_merge($data, ['userRole' => 'editor']));
            } else {
                // Redirect viewers to blog
                return redirect('/blog');
            }
        } catch (\Exception $e) {
            return redirect('/blog')->withErrors(['error' => 'Unable to load dashboard']);
        }
    }

    private function getAdminData()
    {
        return [
            'stats' => [
                'totalUsers' => User::count(),
                'totalPosts' => Post::count(),
                'pendingApplications' => EditorApplication::where('status', 'pending')->count(),
                'activeEditors' => User::role('editor')->count(),
            ],
            'recentUsers' => User::latest()->take(5)->get()->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->getRoleNames()->first() ?? 'viewer',
                    'verified' => $user->email_verified_at !== null,
                    'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                ];
            }),
            'recentPosts' => Post::with('author')->latest()->take(5)->get(),
            'recentApplications' => EditorApplication::with('user')
                ->where('status', 'pending')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($app) {
                    return [
                        'id' => $app->id,
                        'user' => [
                            'id' => $app->user->id,
                            'name' => $app->user->name,
                            'email' => $app->user->email,
                        ],
                        'status' => $app->status,
                        'created_at' => $app->created_at->format('Y-m-d H:i:s'),
                        'motivation' => substr($app->motivation, 0, 100) . '...',
                    ];
                }),
            'pendingPosts' => Post::where('status', 'draft')
                ->with('author')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($post) {
                    return [
                        'id' => $post->id,
                        'title' => $post->title,
                        'status' => $post->status,
                        'author' => [
                            'name' => $post->author->name ?? 'Unknown'
                        ],
                        'created_at' => $post->created_at->format('Y-m-d H:i:s'),
                    ];
                }),
        ];
    }

    private function getEditorData()
    {
        $user = Auth::user();
        
        return [
            'stats' => [
                'myPosts' => Post::where('author_id', $user->id)->count(),
                'publishedPosts' => Post::where('author_id', $user->id)->where('status', 'published')->count(),
                'draftPosts' => Post::where('author_id', $user->id)->where('status', 'draft')->count(),
                'totalViews' => 0,
            ],
            'recentPosts' => Post::where('author_id', $user->id)
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($post) {
                    return [
                        'id' => $post->id,
                        'title' => $post->title,
                        'status' => $post->status,
                        'created_at' => $post->created_at->format('Y-m-d H:i:s'),
                    ];
                }),
            'pendingPosts' => Post::where('author_id', $user->id)
                ->where('status', 'draft')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($post) {
                    return [
                        'id' => $post->id,
                        'title' => $post->title,
                        'status' => $post->status,
                        'created_at' => $post->created_at->format('Y-m-d H:i:s'),
                    ];
                }),
        ];
    }

    /**
     * Display a listing of users (Admin only)
     */
    public function index(Request $request)
    {
        // Check if user is admin
        if (!auth()->user()->hasRole('admin')) {
            return redirect('/dashboard')->with('error', 'Access denied');
        }

        $query = User::with('roles');

        // Search functionality
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('email', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Filter by role
        if ($request->filled('role')) {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('name', $request->role);
            });
        }

        $users = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at, // ADD THIS LINE
                    'created_at' => $user->created_at,
                    'roles' => $user->roles,
                ];
            })
            ->withQueryString();

        // Get role statistics
        $stats = [
            'total' => User::count(),
            'admins' => User::role('admin')->count(),
            'editors' => User::role('editor')->count(),
            'viewers' => User::role('viewer')->count(),
        ];

        return Inertia::render('user-management/UserManager', [
            'users' => $users,
            'filters' => [
                'search' => $request->search,
                'role' => $request->role,
            ],
            'stats' => $stats
        ]);
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        // Check if user is admin
        if (!auth()->user()->hasRole('admin')) {
            return back()->with('error', 'Access denied');
        }

        // Validate request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:admin,editor,viewer',
        ]);

        try {
            // Create user
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'email_verified_at' => now(), // Auto verify
            ]);

            // Assign role
            $user->assignRole($validated['role']);

            return back()->with('message', 'User created successfully!');

        } catch (\Exception $e) {
            return back()->with('error', 'Failed to create user: ' . $e->getMessage());
        }
    }

    /**
     * Update user (match route name: updateUser)
     */
    public function updateUser(Request $request, User $user)
    {
        // Check if user is admin
        if (!auth()->user()->hasRole('admin')) {
            return back()->with('error', 'Access denied');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|string|in:admin,editor,viewer'
        ]);

        try {
            // Update user basic info
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'email_verified_at' => now(), // Ensure user is verified
            ]);

            // Update role - SYNC to replace all roles
            $user->syncRoles([$validated['role']]);

            return back()->with('message', 'User updated successfully!');

        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update user: ' . $e->getMessage());
        }
    }

    /**
     * Delete user (match route name: destroyUser)
     */
    public function destroyUser(User $user)
    {
        // Check if user is admin
        if (!auth()->user()->hasRole('admin')) {
            return back()->with('error', 'Access denied');
        }

        try {
            // Don't allow admin to delete themselves
            if ($user->id === auth()->id()) {
                return back()->with('error', 'You cannot delete your own account');
            }

            $user->delete();

            return back()->with('message', 'User deleted successfully');

        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete user');
        }
    }
}