<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Arr;

class ImageUploadController extends Controller
{
    public function upload(Request $request)
    {
        try {
            // Validate request
            if (!$request->hasFile('image')) {
                return $this->errorResponse('No image file provided', 400);
            }

            $file = $request->file('image');
            
            if (!$file->isValid()) {
                return $this->errorResponse('Invalid file upload', 400);
            }

            // Validate file type and size
            $request->validate([
                'image' => [
                    'required',
                    'file',
                    'image',
                    'mimes:jpeg,png,jpg,gif,webp',
                    'max:5120' // 5MB
                ]
            ]);

            // Create directory if not exists
            $this->ensureDirectoryExists();

            // Generate safe filename
            $filename = $this->generateSafeFilename($file);
            
            // Store the file
            $path = $file->storeAs('editor-images', $filename, 'public');
            
            if (!$path) {
                throw new \Exception('Failed to store file');
            }
            
            // Verify file exists
            if (!Storage::disk('public')->exists($path)) {
                throw new \Exception('File was not saved to disk');
            }

            // Generate URL
            $url = asset('storage/' . $path);

            return $this->successResponse([
                'url' => $url,
                'path' => $path,
                'filename' => $filename
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Ganti array_flatten dengan Arr::flatten atau cara manual
            $errors = collect($e->errors())->flatten()->implode(', ');
            return $this->errorResponse('Validation failed: ' . $errors, 422);
            
        } catch (\Exception $e) {
            Log::error('Image upload failed: ' . $e->getMessage());
            return $this->errorResponse('Upload failed: ' . $e->getMessage(), 500);
        }
    }

    public function testStorage()
    {
        try {
            $storagePath = storage_path('app/public');
            $publicPath = public_path('storage');
            
            return response()->json([
                'storage_path' => $storagePath,
                'storage_exists' => file_exists($storagePath),
                'storage_writable' => is_writable($storagePath),
                'public_path' => $publicPath,
                'public_exists' => file_exists($publicPath),
                'public_readable' => is_readable($publicPath),
                'symlink_exists' => is_link($publicPath),
                'editor_images_path' => $storagePath . '/editor-images',
                'editor_images_exists' => file_exists($storagePath . '/editor-images'),
                'php_upload_max_filesize' => ini_get('upload_max_filesize'),
                'php_post_max_size' => ini_get('post_max_size'),
                'php_memory_limit' => ini_get('memory_limit')
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()]);
        }
    }

    private function ensureDirectoryExists()
    {
        $storagePath = storage_path('app/public/editor-images');
        if (!file_exists($storagePath)) {
            if (!mkdir($storagePath, 0775, true)) {
                throw new \Exception('Failed to create storage directory');
            }
        }
    }

    private function generateSafeFilename($file)
    {
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $basename = pathinfo($originalName, PATHINFO_FILENAME);
        $safeBasename = preg_replace('/[^a-zA-Z0-9\-_]/', '', $basename);
        
        return time() . '_' . ($safeBasename ?: 'image') . '.' . $extension;
    }

    private function successResponse($data)
    {
        return response()->json([
            'success' => true,
            ...$data
        ]);
    }

    private function errorResponse($message, $status = 500)
    {
        return response()->json([
            'success' => false,
            'error' => $message
        ], $status);
    }
}