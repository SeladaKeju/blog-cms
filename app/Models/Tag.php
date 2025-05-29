<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'usage_count',
        'created_by',
    ];

    protected $casts = [
        'usage_count' => 'integer',
    ];

    // ==================== RELATIONSHIPS ====================

    /**
     * Posts yang menggunakan tag ini (Many-to-Many)
     */
    public function posts()
    {
        return $this->belongsToMany(Post::class, 'post_tags')
                    ->withTimestamps();
    }

    /**
     * Published posts yang menggunakan tag ini
     */
    public function publishedPosts()
    {
        return $this->belongsToMany(Post::class, 'post_tags')
                    ->where('status', 'published')
                    ->where('published_at', '<=', now())
                    ->withTimestamps();
    }

    /**
     * User yang membuat tag
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // ==================== HELPER METHODS ====================

    /**
     * Update usage count
     */
    public function updateUsageCount()
    {
        $this->update([
            'usage_count' => $this->publishedPosts()->count()
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
