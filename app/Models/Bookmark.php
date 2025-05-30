<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bookmark extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'post_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    // Static Methods
    public static function exists($userId, $postId): bool
    {
        return static::where('user_id', $userId)
            ->where('post_id', $postId)
            ->exists();
    }

    public static function toggle($userId, $postId): bool
    {
        $bookmark = static::where('user_id', $userId)
            ->where('post_id', $postId)
            ->first();

        if ($bookmark) {
            $bookmark->delete();
            return false; // Removed
        } else {
            static::create([
                'user_id' => $userId,
                'post_id' => $postId,
            ]);
            return true; // Added
        }
    }

    // Scopes
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForPost($query, $postId)
    {
        return $query->where('post_id', $postId);
    }

    public function scopeWithPost($query)
    {
        return $query->with('post');
    }

    public function scopeWithUser($query)
    {
        return $query->with('user');
    }

    public function scopeRecent($query)
    {
        return $query->latest();
    }
}
