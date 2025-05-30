<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Post extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'thumbnail',
        'status',
        'published_at',
        'author_id',        // Add for RBAC
        'approved_by',      // Add for RBAC
        'approved_at',      // Add for RBAC
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'status' => 'string',
        'published_at' => 'datetime',
        'approved_at' => 'datetime',  // Add for RBAC
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Status constants (Updated for RBAC)
     */
    const STATUS_DRAFT = 'draft';
    const STATUS_PENDING_REVIEW = 'pending_review';  // Add for RBAC
    const STATUS_PUBLISHED = 'published';
    const STATUS_REJECTED = 'rejected';              // Add for RBAC
    const STATUS_ARCHIVED = 'archived';

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($post) {
            // Generate slug if not provided
            if (empty($post->slug)) {
                $post->slug = $post->generateUniqueSlug($post->title);
            }
        });

        static::updating(function ($post) {
            // Update slug if title changed and slug is not manually set
            if ($post->isDirty('title') && !$post->isDirty('slug')) {
                $post->slug = $post->generateUniqueSlug($post->title);
            }
        });
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    // RBAC Relationships
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // Bookmark Relationships
    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    public function bookmarkedBy()
    {
        return $this->belongsToMany(User::class, 'bookmarks');
    }

    /**
     * Get the formatted published date
     */
    public function getPublishedDateAttribute()
    {
        return $this->published_at?->format('F j, Y');
    }

    // Status Check Methods (Updated for RBAC)
    public function isPublished()
    {
        return $this->status === self::STATUS_PUBLISHED;
    }

    public function isDraft()
    {
        return $this->status === self::STATUS_DRAFT;
    }

    public function isPendingReview()
    {
        return $this->status === self::STATUS_PENDING_REVIEW;
    }

    public function isRejected()
    {
        return $this->status === self::STATUS_REJECTED;
    }

    // RBAC Action Methods
    public function submitForReview()
    {
        $this->update(['status' => self::STATUS_PENDING_REVIEW]);
    }

    public function approve($approverId)
    {
        $this->update([
            'status' => self::STATUS_PUBLISHED,
            'approved_by' => $approverId,
            'approved_at' => now(),
            'published_at' => now(),
        ]);
    }

    public function reject($approverId)
    {
        $this->update([
            'status' => self::STATUS_REJECTED,
            'approved_by' => $approverId,
            'approved_at' => now(),
        ]);
    }

    /**
     * Scope a query to only include published posts
     */
    public function scopePublished($query)
    {
        return $query->where('status', self::STATUS_PUBLISHED)
                    ->whereNotNull('published_at')
                    ->where('published_at', '<=', now());
    }

    /**
     * Scope a query to only include draft posts
     */
    public function scopeDraft($query)
    {
        return $query->where('status', self::STATUS_DRAFT);
    }

    /**
     * Scope a query to only include pending review posts
     */
    public function scopePendingReview($query)
    {
        return $query->where('status', self::STATUS_PENDING_REVIEW);
    }

    /**
     * Scope a query to only include rejected posts
     */
    public function scopeRejected($query)
    {
        return $query->where('status', self::STATUS_REJECTED);
    }

    /**
     * Scope by author
     */
    public function scopeByAuthor($query, $authorId)
    {
        return $query->where('author_id', $authorId);
    }

    /**
     * Generate a unique slug
     */
    public function generateUniqueSlug($title)
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        $query = static::where('slug', $slug);
        if ($this->id) {
            $query->where('id', '!=', $this->id);
        }

        while ($query->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
            $query = static::where('slug', $slug);
            if ($this->id) {
                $query->where('id', '!=', $this->id);
            }
        }

        return $slug;
    }

    /**
     * Get the URL for the blog post
     */
    public function getUrlAttribute()
    {
        return route('blog.show', $this->slug);
    }

    /**
     * Get the full URL for the blog post
     */
    public function getFullUrlAttribute()
    {
        return url('/blog/' . $this->slug);
    }

    // Helper method untuk check bookmark
    public function isBookmarkedBy($userId): bool
    {
        return Bookmark::exists($userId, $this->id);
    }

    public function getBookmarkCount(): int
    {
        return $this->bookmarks()->count();
    }
}
