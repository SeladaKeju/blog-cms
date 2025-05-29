<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            // Ownership and approval
            $table->foreignId('user_id')->after('id')->constrained('users')->onDelete('cascade');
            $table->foreignId('approved_by')->nullable()->after('user_id')->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable()->after('approved_by');
            
            // Drop existing status column
            $table->dropColumn('status');
        });
        
        // Re-add status with new enum values for approval workflow
        Schema::table('posts', function (Blueprint $table) {
            $table->enum('status', ['draft', 'pending_review', 'approved', 'published', 'rejected', 'archived'])
                  ->default('draft')->after('approved_at');
        });
        
        Schema::table('posts', function (Blueprint $table) {
            // Additional fields
            $table->text('rejection_reason')->nullable()->after('status');
            $table->boolean('featured')->default(false)->after('rejection_reason');
            $table->integer('view_count')->default(0)->after('featured');
            $table->timestamp('scheduled_at')->nullable()->after('view_count');
            
            // Tracking fields
            $table->foreignId('edited_by')->nullable()->after('scheduled_at')->constrained('users')->onDelete('set null');
            $table->timestamp('edited_at')->nullable()->after('edited_by');
            
            // Additional indexes
            $table->index('user_id');
            $table->index('approved_by');
            $table->index('approved_at');
            $table->index('featured');
            $table->index('view_count');
            $table->index('scheduled_at');
            $table->index('edited_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            // Drop foreign key constraints first
            $table->dropForeign(['user_id']);
            $table->dropForeign(['approved_by']);
            $table->dropForeign(['edited_by']);
            
            // Drop indexes
            $table->dropIndex(['user_id']);
            $table->dropIndex(['approved_by']);
            $table->dropIndex(['approved_at']);
            $table->dropIndex(['featured']);
            $table->dropIndex(['view_count']);
            $table->dropIndex(['scheduled_at']);
            $table->dropIndex(['edited_by']);
            
            // Drop columns
            $table->dropColumn([
                'user_id', 'approved_by', 'approved_at', 'rejection_reason',
                'featured', 'view_count', 'scheduled_at', 'edited_by', 'edited_at'
            ]);
        });
        
        // Restore original status enum
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('status');
        });
        
        Schema::table('posts', function (Blueprint $table) {
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
        });
    }
};