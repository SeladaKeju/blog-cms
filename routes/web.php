<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\EditorApplicationController;
use App\Http\Controllers\ImageUploadController;  // Add this import
use App\Http\Controllers\BookmarkController; // Add this import
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Blog Routes
Route::get('/', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog', [BlogController::class, 'index'])->name('blog.home');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');

// Editor Application Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/apply', [EditorApplicationController::class, 'create'])->name('editor-application.create');
    Route::post('/apply', [EditorApplicationController::class, 'store'])->name('editor-application.store');
    Route::get('/application/status', [EditorApplicationController::class, 'status'])->name('editor-application.status');
});

// CMS Routes (Auth Required)
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard - Role-based routing
    Route::get('/dashboard', [UserController::class, 'dashboard'])
        ->middleware('role:admin|editor')
        ->name('dashboard');
    
    // Admin only routes
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        // User Management Routes
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'updateUser'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroyUser'])->name('users.destroy');
        
        // Editor Applications Management
        Route::get('/editor-applications', [EditorApplicationController::class, 'index'])->name('editor-applications.index');
        Route::get('/editor-applications/{application}', [EditorApplicationController::class, 'show'])->name('editor-applications.show');
        Route::post('/editor-applications/{application}/approve', [EditorApplicationController::class, 'approve'])->name('editor-applications.approve');
        Route::post('/editor-applications/{application}/reject', [EditorApplicationController::class, 'reject'])->name('editor-applications.reject');
    });
    
    // Image Upload Route - Add this new route
    Route::post('/upload-image', [ImageUploadController::class, 'upload'])->name('image.upload');
    
    // For testing storage configuration
    Route::get('/test-storage', [ImageUploadController::class, 'testStorage'])->name('image.test-storage');
    
    // Article Management Routes (Editor and Admin)
    Route::middleware(['role:editor|admin'])->group(function () {
        // 1. ROUTE STATIS - letakkan di awal
        Route::get('/posts/pending/review', [PostsController::class, 'pending'])->name('posts.pending');
        Route::get('/posts/create', [PostsController::class, 'create'])->name('posts.create');
        Route::get('/posts', [PostsController::class, 'index'])->name('posts.index');
        Route::post('/posts', [PostsController::class, 'store'])->name('posts.store');
        
        // 2. ROUTE DINAMIS - letakkan setelah route statis
        Route::get('/posts/{post}/edit', [PostsController::class, 'edit'])->name('posts.edit');
        Route::put('/posts/{post}', [PostsController::class, 'update'])->name('posts.update');
        Route::delete('/posts/{post}', [PostsController::class, 'destroy'])->name('posts.destroy');
        Route::get('/posts/{post}', [PostsController::class, 'show'])->name('posts.show');
        
        // 3. ROUTE LAINNYA
        Route::post('/posts/{post}/submit-review', [PostsController::class, 'submitForReview'])->name('posts.submit-review');
        Route::post('/posts/{post}/approve', [PostsController::class, 'approve'])->name('posts.approve');
        Route::post('/posts/{post}/reject', [PostsController::class, 'reject'])->name('posts.reject');
    });
});

// Profile routes (All authenticated users)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [UserController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [UserController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [UserController::class, 'destroy'])->name('profile.destroy');
});

// Bookmark routes (All authenticated users)
Route::middleware('auth')->group(function () {
    // Bookmark routes
    Route::get('/blog/bookmarks', [BookmarkController::class, 'index'])->name('blog.bookmarks');
    Route::delete('/bookmarks/{bookmark}', [BookmarkController::class, 'destroy'])->name('bookmarks.destroy');
    
    // Bookmark API routes
    Route::post('/api/bookmarks/toggle/{postId}', [BookmarkController::class, 'toggle'])->name('bookmarks.toggle');
    Route::get('/api/bookmarks/check/{postId}', [BookmarkController::class, 'check'])->name('bookmarks.check');
});

require __DIR__.'/auth.php';
