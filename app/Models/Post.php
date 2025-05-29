<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'approved_by',
        'approved_at',
        'title',
        'slug',
        'excerpt',
        'content',
        'thumbnail',
        'status',
        'rejection_reason',
        'featured',
        'view_count',
        'scheduled_at',
        'edited_by',
        'edited_at',
        'published_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'approved_at' => 'datetime',
        'scheduled_at' => 'datetime',
        'edited_at' => 'datetime',
        'published_at' => 'datetime',
        'featured' => 'boolean',
        'view_count' => 'integer',
    ];

    // ==================== RELATIONSHIPS ====================

    /**
     * User yang memiliki post (One-to-Many inverse)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * User yang approve post (One-to-Many inverse)
     */
    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * User yang edit post (One-to-Many inverse)
     */
    public function editedBy()
    {
        return $this->belongsTo(User::class, 'edited_by');
    }

    /**
     * Categories post (Many-to-Many)
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'post_categories')
                    ->withTimestamps();
    }

    /**
     * Tags post (Many-to-Many)
     */
    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'post_tags')
                    ->withTimestamps();
    }

    /**
     * Bookmarks untuk post ini (One-to-Many)
     */
    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    /**
     * Users yang bookmark post ini (Many-to-Many through Bookmark)
     */
    public function bookmarkedBy()
    {
        return $this->belongsToMany(User::class, 'bookmarks')
                    ->withPivot('notes')
                    ->withTimestamps();
    }

    /**
     * Views untuk post ini (One-to-Many)
     */
    public function views()
    {
        return $this->hasMany(PostView::class);
    }

    // ==================== SCOPES ====================

    /**
     * Scope untuk posts yang published
     */
    public function scopePublished(Builder $query)
    {
        return $query->where('status', 'published')
                    ->where('published_at', '<=', now());
    }

    /**
     * Scope untuk posts yang featured
     */
    public function scopeFeatured(Builder $query)
    {
        return $query->where('featured', true);
    }

    /**
     * Scope untuk posts berdasarkan status
     */
    public function scopeWithStatus(Builder $query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope untuk posts yang pending review
     */
    public function scopePendingReview(Builder $query)
    {
        return $query->where('status', 'pending_review');
    }

    /**
     * Scope untuk posts yang scheduled
     */
    public function scopeScheduled(Builder $query)
    {
        return $query->where('status', 'approved')
                    ->whereNotNull('scheduled_at')
                    ->where('scheduled_at', '>', now());
    }

    /**
     * Scope untuk posts milik user tertentu
     */
    public function scopeByUser(Builder $query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    // ==================== HELPER METHODS ====================

    /**
     * Check if post is published
     */
    public function isPublished()
    {
        return $this->status === 'published' && 
               $this->published_at && 
               $this->published_at <= now();
    }

    /**
     * Check if post is draft
     */
    public function isDraft()
    {
        return $this->status === 'draft';
    }

    /**
     * Check if post is pending review
     */
    public function isPendingReview()
    {
        return $this->status === 'pending_review';
    }

    /**
     * Check if post is scheduled
     */
    public function isScheduled()
    {
        return $this->status === 'approved' && 
               $this->scheduled_at && 
               $this->scheduled_at > now();
    }

    /**
     * Publish post
     */
    public function publish()
    {
        $this->update([
            'status' => 'published',
            'published_at' => now(),
        ]);
    }

    /**
     * Submit for review
     */
    public function submitForReview()
    {
        $this->update(['status' => 'pending_review']);
    }

    /**
     * Approve post
     */
    public function approve($approvedBy = null)
    {
        $this->update([
            'status' => 'approved',
            'approved_by' => $approvedBy,
            'approved_at' => now(),
        ]);
    }

    /**
     * Reject post
     */
    public function reject($reason = null)
    {
        $this->update([
            'status' => 'rejected',
            'rejection_reason' => $reason,
        ]);
    }

    /**
     * Increment view count
     */
    public function incrementViewCount()
    {
        $this->increment('view_count');
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

    /**
     * Get reading time estimate (words per minute)
     */
    public function getReadingTimeAttribute()
    {
        $wordCount = str_word_count(strip_tags($this->content));
        $minutesToRead = ceil($wordCount / 200); // Average reading speed: 200 words per minute
        
        return $minutesToRead;
    }
}
