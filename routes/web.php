<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\EditorApplicationController;
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
        
        // User Management Routes - MAKE SURE THESE EXIST
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
    
    // Editor and Admin routes
    Route::middleware(['role:editor|admin'])->group(function () {
        Route::resource('posts', PostController::class);
    });
});

// Profile routes (All authenticated users)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [UserController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [UserController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [UserController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
