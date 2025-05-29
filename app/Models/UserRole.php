<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'role_id',
        'assigned_by',
        'assigned_at',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
    ];

    // ==================== RELATIONSHIPS ====================

    /**
     * User yang memiliki role
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Role yang dimiliki
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * User yang melakukan assignment
     */
    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }
}
