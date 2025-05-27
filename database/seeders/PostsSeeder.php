<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class PostsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Create 10 sample blog posts
        for ($i = 1; $i <= 10; $i++) {
            $title = $faker->sentence(4);
            $isPublished = $faker->boolean(70); // 70% chance of being published
            
            Post::create([
                'title' => $title,
                'slug' => \Illuminate\Support\Str::slug($title) . '-' . $i, // Ensure unique slug
                'excerpt' => $faker->paragraph(2),
                'content' => '<p>' . implode('</p><p>', $faker->paragraphs(5)) . '</p>',
                'status' => $isPublished ? 'published' : 'draft',
                'published_at' => $isPublished ? $faker->dateTimeBetween('-6 months', 'now') : null,
                'created_at' => $faker->dateTimeBetween('-1 year', 'now'),
                'updated_at' => now()
            ]);
        }

        // Create a few specific example posts
        Post::create([
            'title' => 'Welcome to Our Blog',
            'slug' => 'welcome-to-our-blog',
            'excerpt' => 'This is our first blog post. Learn about what we do and what you can expect from our content.',
            'content' => '<p>Welcome to our blog! We\'re excited to share our thoughts, insights, and experiences with you.</p><p>In this space, you\'ll find articles about technology, programming, and web development. Our goal is to provide valuable content that helps you grow and learn.</p><p>Stay tuned for more exciting content!</p>',
            'status' => 'published',
            'published_at' => now()->subDays(30),
            'created_at' => now()->subDays(30),
            'updated_at' => now()->subDays(30)
        ]);

        Post::create([
            'title' => 'Getting Started with Laravel',
            'slug' => 'getting-started-with-laravel',
            'excerpt' => 'A beginner-friendly guide to Laravel framework. Learn the basics and start building amazing web applications.',
            'content' => '<p>Laravel is one of the most popular PHP frameworks, and for good reason. It makes web development enjoyable and creative.</p><p>In this post, we\'ll cover the basics of Laravel and help you get started with your first project.</p><p>Laravel provides elegant syntax, powerful features, and excellent documentation that makes it perfect for both beginners and experienced developers.</p>',
            'status' => 'published',
            'published_at' => now()->subDays(15),
            'created_at' => now()->subDays(15),
            'updated_at' => now()->subDays(15)
        ]);

        Post::create([
            'title' => 'Understanding React Components',
            'slug' => 'understanding-react-components',
            'excerpt' => 'Dive deep into React components and learn how to build reusable UI elements for your applications.',
            'content' => '<p>React components are the building blocks of any React application. Understanding how they work is crucial for building scalable and maintainable applications.</p><p>In this article, we\'ll explore different types of components, their lifecycle methods, and best practices for component design.</p>',
            'status' => 'draft',
            'published_at' => null,
            'created_at' => now()->subDays(5),
            'updated_at' => now()->subDays(5)
        ]);
    }
}
