<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Feature;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FeaturesController extends Controller
{
    public function index()
    {
        $features = Feature::all();
        return response()->json($features);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'icon' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->storePublicly('images', 'public');
            $imageUrl = url(Storage::url($imagePath));
        } else {
            $imageUrl = null;
        }

        $feature = Feature::create([
            'title' => $request->title,
            'content' => $request->content,
            'icon' => $request->icon,
            'image' => $imageUrl,
        ]);

        return response()->json($feature, 201);
    }




}
