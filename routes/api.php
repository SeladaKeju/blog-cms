<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Route;

Route::post('/upload-image', function (Request $request) {
    $request->validate([
        'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
    ]);

    $path = $request->file('image')->store('public/uploads');
    
    return response()->json([
        'url' => Storage::url($path)
    ]);
});