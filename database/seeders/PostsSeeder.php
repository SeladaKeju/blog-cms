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
        for ($i = 0; $i < 10; $i++) {
            Post::create([
                'title' => $faker->sentence(),
                'excerpt' => $faker->paragraph(2),
                'content' => $faker->paragraphs(6, true),
                'thumbnail' => 'posts/thumbnail-' . ($i + 1) . '.jpg',
                'generate_image' => 'posts/generated-' . ($i + 1) . '.jpg',
                'is_published' => $faker->boolean(80), // 80% chance of being published
                'published_at' => $faker->boolean(80) ? $faker->dateTimeBetween('-1 year', 'now') : null,
                'created_at' => $faker->dateTimeBetween('-1 year', 'now'),
                'updated_at' => $faker->dateTimeBetween('-1 year', 'now')
            ]);
        }
    }
}
