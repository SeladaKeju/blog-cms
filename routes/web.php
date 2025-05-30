<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\PostsController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\EditorApplicationController;
use App\Http\Controllers\ImageUploadController;
use App\Http\Controllers\BlogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Root route redirect to login if not authenticated, dashboard if authenticated
Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

// Public Blog Routes
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');

// CMS Routes (Auth Required)
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard - Role-based routing menggunakan UserController
    Route::get('/dashboard', [UserController::class, 'dashboard'])->name('dashboard');
    
    // Bookmark routes (All authenticated users with permission)
    Route::middleware(['permission:manage-bookmarks'])->group(function () {
        Route::get('/bookmarks', [BookmarkController::class, 'index'])->name('bookmarks.index');
        Route::post('/bookmarks/toggle/{post}', [BookmarkController::class, 'toggle'])->name('bookmarks.toggle');
        Route::delete('/bookmarks/{bookmark}', [BookmarkController::class, 'destroy'])->name('bookmarks.destroy');
        Route::get('/bookmarks/check/{post}', [BookmarkController::class, 'check'])->name('bookmarks.check');
    });
    
    // Viewer specific routes
    Route::middleware(['role:viewer'])->group(function () {
        Route::get('/apply-editor', [EditorApplicationController::class, 'create'])->name('editor-application.create');
        Route::post('/apply-editor', [EditorApplicationController::class, 'store'])->name('editor-application.store');
    });
    
    // Editor application status (all users can check their own)
    Route::get('/editor-application/status', [EditorApplicationController::class, 'status'])->name('editor-application.status');
    
    // Article management routes (Editor & Admin only)
    Route::middleware(['permission:create-posts'])->group(function () {
        Route::get('/article', [PostsController::class, 'index'])->name('article');
        Route::get('/posts', [PostsController::class, 'index'])->name('posts.index'); // Alternative route
        Route::get('/posts/create', [PostsController::class, 'create'])->name('posts.create');
        Route::post('/posts', [PostsController::class, 'store'])->name('posts.store');
        Route::get('/posts/{post}/edit', [PostsController::class, 'edit'])->name('posts.edit');
        Route::put('/posts/{post}', [PostsController::class, 'update'])->name('posts.update');
        Route::delete('/posts/{post}', [PostsController::class, 'destroy'])->name('posts.destroy');
        Route::post('/posts/{post}/submit-review', [PostsController::class, 'submitForReview'])->name('posts.submit-review');
    });
    
    // Admin only routes
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        
        // User Management
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
        Route::put('/users/{user}', [UserController::class, 'updateUser'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroyUser'])->name('users.destroy');
        
        // Editor Applications Management
        Route::get('/editor-applications', [EditorApplicationController::class, 'index'])->name('editor-applications.index');
        Route::get('/editor-applications/{application}', [EditorApplicationController::class, 'show'])->name('editor-applications.show');
        Route::post('/editor-applications/{application}/approve', [EditorApplicationController::class, 'approve'])->name('editor-applications.approve');
        Route::post('/editor-applications/{application}/reject', [EditorApplicationController::class, 'reject'])->name('editor-applications.reject');
        
        // Post Approval (Admin only)
        Route::get('/posts/pending', [PostsController::class, 'pending'])->name('posts.pending');
        Route::post('/posts/{post}/approve', [PostsController::class, 'approve'])->name('posts.approve');
        Route::post('/posts/{post}/reject', [PostsController::class, 'reject'])->name('posts.reject');
    });
    
    // Image upload routes (Editor & Admin only)
    Route::middleware(['permission:create-posts'])->group(function () {
        Route::post('/upload-image', [ImageUploadController::class, 'upload'])->name('upload-image');
        Route::get('/test-storage', [ImageUploadController::class, 'testStorage'])->name('test.storage');
    });
});

// Profile routes (All authenticated users)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [UserController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [UserController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [UserController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
