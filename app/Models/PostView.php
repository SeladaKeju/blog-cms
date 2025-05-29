<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostView extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'user_id',
        'ip_address',
        'user_agent',
        'viewed_at',
    ];

    protected $casts = [
        'viewed_at' => 'datetime',
    ];

    public $timestamps = false; // We're using viewed_at instead

    // ==================== RELATIONSHIPS ====================

    /**
     * Post yang dilihat
     */
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * User yang melihat (nullable)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // ==================== HELPER METHODS ====================

    /**
     * Create new view record
     */
    public static function createView($postId, $userId = null, $ipAddress = null, $userAgent = null)
    {
        // Prevent duplicate views from same user/IP in last 30 minutes
        $recentView = static::where('post_id', $postId)
            ->where(function ($query) use ($userId, $ipAddress) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('ip_address', $ipAddress);
                }
            })
            ->where('viewed_at', '>', now()->subMinutes(30))
            ->exists();

        if (!$recentView) {
            return static::create([
                'post_id' => $postId,
                'user_id' => $userId,
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
                'viewed_at' => now(),
            ]);
        }

        return null;
    }
}
