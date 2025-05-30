<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'manage-bookmarks',
            'view-posts',
            'create-posts', 
            'edit-own-posts',
            'edit-all-posts',
            'delete-own-posts',
            'delete-all-posts',
            'approve-posts',
            'manage-users',
            'view-applications',
            'approve-applications',
            'apply-editor',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $adminRole = Role::create(['name' => 'admin']);
        $editorRole = Role::create(['name' => 'editor']);
        $viewerRole = Role::create(['name' => 'viewer']);

        // Admin gets all permissions
        $adminRole->givePermissionTo(Permission::all());

        // Editor permissions
        $editorRole->givePermissionTo([
            'manage-bookmarks',
            'view-posts',
            'create-posts',
            'edit-own-posts',
            'delete-own-posts',
        ]);

        // Viewer permissions
        $viewerRole->givePermissionTo([
            'manage-bookmarks',
            'apply-editor',
        ]);

        // Create default users and assign roles
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@blog-cms.com',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');

        $editor = User::create([
            'name' => 'Editor User',
            'email' => 'editor@blog-cms.com',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);
        $editor->assignRole('editor');

        $viewer = User::create([
            'name' => 'Viewer User',
            'email' => 'viewer@blog-cms.com',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);
        $viewer->assignRole('viewer');
    }
}
