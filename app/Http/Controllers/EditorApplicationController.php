<?php

namespace App\Http\Controllers;

use App\Models\EditorApplication;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EditorApplicationController extends Controller
{
    /**
     * Display a listing of editor applications (Admin only)
     */
    public function index()
    {
        // Check permission
        if (!Auth::user()->can('view-applications')) {
            abort(403, 'Unauthorized');
        }

        $applications = EditorApplication::with(['user', 'reviewer'])
            ->recentFirst()
            ->paginate(10);

        return Inertia::render('Admin/EditorApplications/Index', [
            'applications' => $applications,
            'stats' => [
                'total' => EditorApplication::count(),
                'pending' => EditorApplication::pending()->count(),
                'approved' => EditorApplication::approved()->count(),
                'rejected' => EditorApplication::rejected()->count(),
            ]
        ]);
    }

    /**
     * Show the form for creating a new editor application
     */
    public function create()
    {
        $user = Auth::user();

        // Check if user is viewer
        if (!$user->hasRole('viewer')) {
            return redirect()->back()->with('error', 'Only viewers can apply to become editors.');
        }

        // Check permission
        if (!$user->can('apply-editor')) {
            abort(403, 'Unauthorized');
        }

        // Check if user already has pending/approved application
        $existingApplication = EditorApplication::byUser($user->id)
            ->whereIn('status', [EditorApplication::STATUS_PENDING, EditorApplication::STATUS_APPROVED])
            ->first();

        if ($existingApplication) {
            return redirect()->route('editor-application.status')
                ->with('info', 'You already have an application.');
        }

        return Inertia::render('Viewer/EditorApplication/Create');
    }

    /**
     * Store a newly created editor application
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Check permission
        if (!$user->can('apply-editor')) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'motivation' => 'required|string|min:100|max:1000',
            'experience' => 'nullable|string|max:1000',
            'portfolio_url' => 'nullable|url|max:255',
        ]);

        // Check for existing application
        $existingApplication = EditorApplication::byUser($user->id)
            ->whereIn('status', [EditorApplication::STATUS_PENDING, EditorApplication::STATUS_APPROVED])
            ->first();

        if ($existingApplication) {
            return redirect()->back()->with('error', 'You already have a pending or approved application.');
        }

        EditorApplication::create([
            'user_id' => $user->id,
            'motivation' => $request->motivation,
            'experience' => $request->experience,
            'portfolio_url' => $request->portfolio_url,
        ]);

        return redirect()->route('dashboard')
            ->with('success', 'Your editor application has been submitted successfully!');
    }

    /**
     * Display the specified editor application
     */
    public function show(EditorApplication $application)
    {
        $user = Auth::user();

        // Check permission (admin can view all, user can view own)
        if (!$user->can('view-applications') && $application->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Admin/EditorApplications/Show', [
            'application' => $application->load(['user', 'reviewer'])
        ]);
    }

    /**
     * Approve editor application
     */
    public function approve(EditorApplication $application)
    {
        // Check permission
        if (!Auth::user()->can('approve-applications')) {
            abort(403, 'Unauthorized');
        }

        if (!$application->isPending()) {
            return redirect()->back()->with('error', 'Application has already been reviewed.');
        }

        $application->approve(Auth::id());

        return redirect()->route('admin.editor-applications.index')
            ->with('success', 'Application approved successfully! User is now an editor.');
    }

    /**
     * Reject editor application
     */
    public function reject(Request $request, EditorApplication $application)
    {
        // Check permission
        if (!Auth::user()->can('approve-applications')) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        if (!$application->isPending()) {
            return redirect()->back()->with('error', 'Application has already been reviewed.');
        }

        $application->reject(Auth::id(), $request->rejection_reason);

        return redirect()->route('admin.editor-applications.index')
            ->with('success', 'Application rejected successfully.');
    }

    /**
     * Get user's application status
     */
    public function status()
    {
        $application = EditorApplication::byUser(Auth::id())
            ->with('reviewer')
            ->latest()
            ->first();

        return Inertia::render('Viewer/EditorApplication/Status', [
            'application' => $application
        ]);
    }

    /**
     * Get pending applications for admin dashboard
     */
    public function pending()
    {
        // Check permission
        if (!Auth::user()->can('view-applications')) {
            abort(403, 'Unauthorized');
        }

        $applications = EditorApplication::with(['user'])
            ->pending()
            ->recentFirst()
            ->limit(5)
            ->get();

        return response()->json($applications);
    }
}
