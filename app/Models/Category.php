<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'thumbnail',
        'sort_order',
        'is_active',
        'post_count',
        'created_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'post_count' => 'integer',
        'sort_order' => 'integer',
    ];

    // ==================== RELATIONSHIPS ====================

    /**
     * Posts dalam category ini (Many-to-Many)
     */
    public function posts()
    {
        return $this->belongsToMany(Post::class, 'post_categories')
                    ->withTimestamps();
    }

    /**
     * Published posts dalam category ini
     */
    public function publishedPosts()
    {
        return $this->belongsToMany(Post::class, 'post_categories')
                    ->where('status', 'published')
                    ->where('published_at', '<=', now())
                    ->withTimestamps();
    }

    /**
     * User yang membuat category
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // ==================== HELPER METHODS ====================

    /**
     * Update post count
     */
    public function updatePostCount()
    {
        $this->update([
            'post_count' => $this->publishedPosts()->count()
        ]);
    }

    /**
     * Get route key name (slug)
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }
}
