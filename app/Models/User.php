<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Support\Facades\Schema;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    // Keep existing role constants for backward compatibility
    const ROLE_ADMIN = 'admin';
    const ROLE_EDITOR = 'editor';
    const ROLE_VIEWER = 'viewer';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Helper methods using Spatie (pure Spatie approach)
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isEditor(): bool
    {
        return $this->hasRole('editor');
    }

    public function isViewer(): bool
    {
        return $this->hasRole('viewer');
    }

    public function canBookmark(): bool
    {
        return $this->can('manage-bookmarks');
    }

    public function canCreatePosts(): bool
    {
        return $this->can('create-posts');
    }

    public function canApprovePosts(): bool
    {
        return $this->can('approve-posts');
    }

    public function canManageUsers(): bool
    {
        return $this->can('manage-users');
    }

    // CONDITIONAL Relationships - Only if columns exist
    public function posts()
    {
        // Check if author_id column exists before using relationship
        if (Schema::hasColumn('posts', 'author_id')) {
            return $this->hasMany(Post::class, 'author_id');
        }
        
        // Return empty relation if column doesn't exist
        return $this->hasMany(Post::class)->whereRaw('1 = 0');
    }

    public function approvedPosts()
    {
        // Check if approved_by column exists
        if (Schema::hasColumn('posts', 'approved_by')) {
            return $this->hasMany(Post::class, 'approved_by');
        }
        
        // Return empty relation if column doesn't exist
        return $this->hasMany(Post::class)->whereRaw('1 = 0');
    }

    // Bookmark Relationships
    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    public function bookmarkedPosts()
    {
        return $this->belongsToMany(Post::class, 'bookmarks');
    }

    // Editor Application Relationships  
    public function editorApplications()
    {
        return $this->hasMany(EditorApplication::class);
    }

    public function reviewedApplications()
    {
        return $this->hasMany(EditorApplication::class, 'reviewed_by');
    }

    // Helper method untuk cek aplikasi editor
    public function hasEditorApplication(): bool
    {
        return $this->editorApplications()->exists();
    }

    public function hasPendingEditorApplication(): bool
    {
        return $this->editorApplications()->pending()->exists();
    }

    public function getLatestEditorApplication()
    {
        return $this->editorApplications()->latest()->first();
    }

    // Helper method untuk post counts (fallback safe)
    public function getPostsCount(): int
    {
        try {
            return $this->posts()->count();
        } catch (\Exception $e) {
            return 0; // Return 0 if error
        }
    }

    public function getPublishedPostsCount(): int
    {
        try {
            if (Schema::hasColumn('posts', 'author_id')) {
                return $this->posts()->where('status', 'published')->count();
            }
            return 0;
        } catch (\Exception $e) {
            return 0;
        }
    }
}
