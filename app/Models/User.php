<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'bio',
        'avatar',
        'phone',
        'status',
        'last_login_at',
        'email_notifications',
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
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'email_notifications' => 'boolean',
            'password' => 'hashed',
        ];
    }

    // ==================== RELATIONSHIPS ====================

    /**
     * User dapat memiliki banyak roles (Many-to-Many)
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles')
                    ->withPivot('assigned_by', 'assigned_at')
                    ->withTimestamps();
    }

    /**
     * Posts yang dimiliki user (One-to-Many)
     */
    public function posts()
    {
        return $this->hasMany(Post::class, 'user_id');
    }

    /**
     * Posts yang di-approve oleh user (One-to-Many)
     */
    public function approvedPosts()
    {
        return $this->hasMany(Post::class, 'approved_by');
    }

    /**
     * Posts yang di-edit oleh user (One-to-Many)
     */
    public function editedPosts()
    {
        return $this->hasMany(Post::class, 'edited_by');
    }

    /**
     * Categories yang dibuat user (One-to-Many)
     */
    public function categories()
    {
        return $this->hasMany(Category::class, 'created_by');
    }

    /**
     * Tags yang dibuat user (One-to-Many)
     */
    public function tags()
    {
        return $this->hasMany(Tag::class, 'created_by');
    }

    /**
     * Bookmarks user (One-to-Many)
     */
    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    /**
     * Posts yang di-bookmark user (Many-to-Many through Bookmark)
     */
    public function bookmarkedPosts()
    {
        return $this->belongsToMany(Post::class, 'bookmarks')
                    ->withPivot('notes')
                    ->withTimestamps();
    }

    /**
     * Views yang dilakukan user (One-to-Many)
     */
    public function postViews()
    {
        return $this->hasMany(PostView::class);
    }

    /**
     * Role assignments yang dilakukan user (One-to-Many)
     */
    public function roleAssignments()
    {
        return $this->hasMany(UserRole::class, 'assigned_by');
    }

    // ==================== HELPER METHODS ====================

    /**
     * Check if user has specific role
     */
    public function hasRole($roleSlug)
    {
        return $this->roles()->where('slug', $roleSlug)->exists();
    }

    /**
     * Check if user has any of the given roles
     */
    public function hasAnyRole($roles)
    {
        if (is_string($roles)) {
            return $this->hasRole($roles);
        }

        return $this->roles()->whereIn('slug', $roles)->exists();
    }

    /**
     * Check if user is admin
     */
    public function isAdmin()
    {
        return $this->hasRole('admin');
    }

    /**
     * Check if user is editor
     */
    public function isEditor()
    {
        return $this->hasRole('editor');
    }

    /**
     * Check if user is viewer
     */
    public function isViewer()
    {
        return $this->hasRole('viewer');
    }

    /**
     * Get user's primary role (first role)
     */
    public function getPrimaryRole()
    {
        return $this->roles()->first();
    }

    /**
     * Assign role to user
     */
    public function assignRole($roleSlug, $assignedBy = null)
    {
        $role = Role::where('slug', $roleSlug)->first();
        
        if ($role && !$this->hasRole($roleSlug)) {
            $this->roles()->attach($role->id, [
                'assigned_by' => $assignedBy,
                'assigned_at' => now(),
            ]);
        }
    }

    /**
     * Remove role from user
     */
    public function removeRole($roleSlug)
    {
        $role = Role::where('slug', $roleSlug)->first();
        
        if ($role) {
            $this->roles()->detach($role->id);
        }
    }

    /**
     * Check if user can edit post
     */
    public function canEditPost(Post $post)
    {
        // Admin can edit all posts
        if ($this->isAdmin()) {
            return true;
        }

        // Editor can edit all posts
        if ($this->isEditor()) {
            return true;
        }

        // Owner can edit own posts
        return $this->id === $post->user_id;
    }

    /**
     * Check if user can approve posts
     */
    public function canApprovePost()
    {
        return $this->isAdmin() || $this->isEditor();
    }
}
