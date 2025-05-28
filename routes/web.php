<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostsController;
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
    // Dashboard menggunakan PostsController
    Route::get('/dashboard', [PostsController::class, 'dashboard'])->name('dashboard');
    
    // Article management routes
    Route::get('/article', [PostsController::class, 'index'])->name('article');
    Route::get('/posts/create', [PostsController::class, 'create'])->name('posts.create');
    Route::post('/posts', [PostsController::class, 'store'])->name('posts.store');
    Route::get('/posts/{id}/edit', [PostsController::class, 'edit'])->name('posts.edit');
    Route::put('/posts/{id}', [PostsController::class, 'update'])->name('posts.update');
    Route::delete('/posts/{id}', [PostsController::class, 'destroy'])->name('posts.destroy');
    
    // Image upload routes
    Route::post('/upload-image', [ImageUploadController::class, 'upload'])->name('upload-image');
    Route::get('/test-storage', [ImageUploadController::class, 'testStorage'])->name('test.storage');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
