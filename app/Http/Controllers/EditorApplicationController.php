<?php

namespace App\Http\Controllers;

use App\Models\EditorApplication;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; // ADD THIS LINE
use Inertia\Inertia;

class EditorApplicationController extends Controller
{
    /**
     * Display list of editor applications (Admin only)
     */
    public function index(Request $request)
    {
        $query = EditorApplication::with('user');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search by user name or email
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->whereHas('user', function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('email', 'LIKE', "%{$searchTerm}%");
            });
        }

        $applications = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        // Get stats
        $stats = [
            'total' => EditorApplication::count(),
            'pending' => EditorApplication::where('status', 'pending')->count(),
            'approved' => EditorApplication::where('status', 'approved')->count(),
            'rejected' => EditorApplication::where('status', 'rejected')->count(),
        ];

        return Inertia::render('application-management/ApplicationList', [
            'applications' => $applications,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
            ],
            'stats' => $stats
        ]);
    }

    /**
     * Show the application form
     */
    public function create()
    {
        $user = Auth::user();

        // Check if user is logged in
        if (!$user) {
            return redirect()->route('login')
                ->with('message', 'Please login to apply as editor');
        }

        // Check if user is viewer (only viewers can apply)
        if (!$user->hasRole('viewer')) {
            return redirect('/blog')
                ->with('message', 'Only viewers can apply to become editors');
        }

        // Check for existing application
        $existingApplication = EditorApplication::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        return Inertia::render('EditorApplication/Apply', [
            'auth' => [
                'user' => $user,
                'userRole' => $user->getRoleNames()->first(),
            ],
            'existingApplication' => $existingApplication
        ]);
    }

    /**
     * Store a newly created editor application
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Check if user is logged in
        if (!$user) {
            return redirect()->route('login')
                ->with('error', 'Please login to apply');
        }

        // Check if user is viewer (only viewers can apply)
        if (!$user->hasRole('viewer')) {
            return redirect()->back()
                ->withErrors(['error' => 'Only viewers can apply to become editors']);
        }

        // Validate request
        $validated = $request->validate([
            'motivation' => 'required|string|min:100|max:1000',
            'experience' => 'nullable|string|max:1000',
            'portfolio_url' => 'nullable|url|max:255',
        ]);

        // Check for existing pending/approved application
        $existingApplication = EditorApplication::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existingApplication) {
            if ($existingApplication->status === 'approved') {
                return redirect()->back()
                    ->withErrors(['error' => 'You are already an approved editor']);
            }
            
            if ($existingApplication->status === 'pending') {
                return redirect()->back()
                    ->withErrors(['error' => 'You already have a pending application']);
            }
        }

        // Create new application
        try {
            EditorApplication::create([
                'user_id' => $user->id,
                'motivation' => $validated['motivation'],
                'experience' => $validated['experience'],
                'portfolio_url' => $validated['portfolio_url'],
                'status' => 'pending',
                'submitted_at' => now(),
            ]);

            return redirect('/blog')
                ->with('message', 'Your editor application has been submitted successfully! We will review it and get back to you soon.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Failed to submit application. Please try again.'])
                ->withInput();
        }
    }

    /**
     * Show specific application details (Admin only)
     */
    public function show(EditorApplication $application)
    {
        $application->load('user');

        return Inertia::render('application-management/ApplicationDetail', [
            'application' => $application
        ]);
    }

    /**
     * Approve an editor application (Admin only)
     */
    public function approve(EditorApplication $application)
    {
        try {
            // Check if application is still pending
            if ($application->status !== 'pending') {
                return redirect()->back()
                    ->withErrors(['error' => 'Application already processed']);
            }

            // Get user and update both role AND email verification
            $user = $application->user;
            
            // Force email verification - Now with correct import
            DB::table('users')
                ->where('id', $user->id)
                ->update(['email_verified_at' => now()]);
            
            // Sync roles (replace all roles with editor)
            $user->syncRoles(['editor']);
            
            // Update application status
            $application->update([
                'status' => 'approved',
                'reviewed_at' => now(),
                'reviewed_by' => Auth::id(),
            ]);

            return redirect()->back()
                ->with('message', 'Application approved successfully! User is now a verified editor.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Failed to approve application. Please try again.']);
        }
    }

    /**
     * Reject an editor application (Admin only)
     */
    public function reject(EditorApplication $application)
    {
        try {
            // Check if application is still pending
            if ($application->status !== 'pending') {
                return redirect()->back()
                    ->withErrors(['error' => 'Application already processed']);
            }

            // Update application status
            $application->update([
                'status' => 'rejected',
                'reviewed_at' => now(),
                'reviewed_by' => Auth::id(),
            ]);

            return redirect()->back()
                ->with('message', 'Application rejected successfully.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Failed to reject application. Please try again.']);
        }
    }
}
