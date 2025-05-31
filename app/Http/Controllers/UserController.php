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
     * Dashboard hanya untuk Admin dan Editor
     */
    public function dashboard()
    {
        $user = auth()->user();
        
        // Redirect viewer ke blog (mereka tidak punya dashboard)
        if ($user->hasRole('viewer')) {
            return redirect('/blog')->with('message', 'Welcome! Enjoy reading our articles.');
        }
        
        // Pastikan user punya role admin/editor
        if (!$user->hasAnyRole(['admin', 'editor'])) {
            // Jika bukan admin/editor, assign viewer dan redirect ke blog
            $user->assignRole('viewer');
            return redirect('/blog')->with('message', 'Welcome! You can now browse and bookmark articles.');
        }
        
        // Get data berdasarkan role
        $dashboardData = $this->getDashboardData($user);
        
        return Inertia::render('Dashboard/index', $dashboardData);
    }

    private function getDashboardData($user)
    {
        $baseData = [
            'user' => $user->load('roles'),
            'userRole' => $user->getRoleNames()->first() ?? 'viewer',
            'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
        ];

        // Data berdasarkan role (hanya admin dan editor)
        switch (true) {
            case $user->hasRole('admin'):
                return array_merge($baseData, $this->getAdminData());
            
            case $user->hasRole('editor'):
                return array_merge($baseData, $this->getEditorData($user));
            
            default:
                // Fallback - seharusnya tidak sampai sini karena viewer sudah redirect
                return redirect('/blog');
        }
    }

    private function getAdminData()
    {
        return [
            'totalUsers' => User::count(),
            'totalPosts' => Post::count(),
            'pendingApplications' => EditorApplication::where('status', 'pending')->count(),
            'recentUsers' => User::latest()->take(5)->get(),
            'recentPosts' => Post::with('author')->latest()->take(5)->get(),
        ];
    }

    private function getEditorData($user)
    {
        return [
            'myPosts' => Post::where('author_id', $user->id)->count(),
            'draftPosts' => Post::where('author_id', $user->id)->where('status', 'draft')->count(),
            'publishedPosts' => Post::where('author_id', $user->id)->where('status', 'published')->count(),
            'recentPosts' => Post::where('author_id', $user->id)->latest()->take(5)->get(),
        ];
    }

    // ===== USER MANAGEMENT METHODS (ADMIN ONLY) =====

    /**
     * Display a listing of users (Admin only)
     */
    public function index(Request $request)
    {
        // Check permission
        if (!auth()->user()->can('manage-users')) {
            abort(403, 'Unauthorized');
        }

        // Query builder
        $query = User::with('roles');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Role filter
        if ($request->filled('role')) {
            $query->role($request->role);
        }

        // Pagination
        $users = $query->latest()->paginate(
            $request->get('per_page', 15)
        );

        return Inertia::render('user-management/UserManager', [
            'users' => $users,
            'filters' => [
                'search' => $request->search,
                'role' => $request->role,
            ]
        ]);
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        // Check permission
        if (!auth()->user()->can('manage-users')) {
            abort(403, 'Unauthorized');
        }

        // Validate request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:admin,editor,viewer',
        ]);

        // Create user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'email_verified_at' => now(),
        ]);

        // Assign role
        $user->assignRole($validated['role']);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully!');
    }

    /**
     * Display the specified user
     */
    public function show(User $user)
    {
        // Check permission
        if (!auth()->user()->can('manage-users')) {
            abort(403, 'Unauthorized');
        }

        // Load relationships
        $user->load([
            'roles', 
            'posts' => function ($query) {
                $query->latest()->limit(10);
            },
            'editorApplications' => function ($query) {
                $query->latest()->limit(5);
            },
            'bookmarks.post' => function ($query) {
                $query->latest()->limit(10);
            }
        ]);

        return Inertia::render('UserManagement/UserProfile', [
            'user' => $user
        ]);
    }

    /**
     * Update the specified user
     */
    public function updateUser(Request $request, User $user)
    {
        // Check permission
        if (!auth()->user()->can('manage-users')) {
            abort(403, 'Unauthorized');
        }

        // Validate request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required', 
                'string', 
                'email', 
                'max:255', 
                Rule::unique('users')->ignore($user->id)
            ],
            'role' => 'required|string|in:admin,editor,viewer',
            'password' => 'nullable|string|min:8|confirmed',
            'change_password' => 'boolean',
        ]);

        // Prepare update data
        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        // Update password if provided
        if ($request->filled('password') && $request->change_password) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        // Update user
        $user->update($updateData);

        // Update role
        $user->syncRoles([$validated['role']]);

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully!');
    }

    /**
     * Remove the specified user
     */
    public function destroyUser(User $user)
    {
        // Check permission
        if (!auth()->user()->can('manage-users')) {
            abort(403, 'Unauthorized');
        }

        // Prevent deleting own account
        if ($user->id === auth()->id()) {
            return redirect()->back()
                ->with('error', 'You cannot delete your own account.');
        }

        // Prevent deleting if user has content
        if ($user->posts()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete user with existing posts. Please reassign or delete posts first.');
        }

        // Delete user
        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully!');
    }
}