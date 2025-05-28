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
        'published_at'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'status' => 'string',
        'published_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Status constants
     */
    const STATUS_DRAFT = 'draft';
    const STATUS_PUBLISHED = 'published';
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

    /**
     * Get the formatted published date
     */
    public function getPublishedDateAttribute()
    {
        return $this->published_at?->format('F j, Y');
    }

    /**
     * Check if the post is published
     */
    public function isPublished()
    {
        return $this->status === self::STATUS_PUBLISHED;
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
}
