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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique(); // Added slug field
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->string('thumbnail')->nullable(); // Made nullable
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->datetime('published_at')->nullable();
            $table->timestamps(); // Use Laravel's timestamps helper
            
            // Add indexes for better performance
            $table->index('status');
            $table->index('published_at');
            $table->index('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
