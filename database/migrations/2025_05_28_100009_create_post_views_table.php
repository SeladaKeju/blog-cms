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
        Schema::create('post_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained('posts')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('ip_address', 45); // Support IPv6
            $table->text('user_agent');
            $table->timestamp('viewed_at')->useCurrent();
            
            // Indexes for analytics
            $table->index('post_id');
            $table->index('user_id');
            $table->index('ip_address');
            $table->index('viewed_at');
            $table->index(['post_id', 'viewed_at']); // Composite for analytics
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_views');
    }
};