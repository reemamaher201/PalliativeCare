<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Section;
use Illuminate\Support\Facades\Storage;

class SectionController extends Controller
{
    public function index()
    {
        $sections = Section::all();
        return response()->json($sections);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->storePublicly('images', 'public');
            $imageUrl = url(Storage::url($imagePath));

        } else {
            $imageUrl = null;
        }

        $section = Section::create([
            'title' => $request->title,
            'content' => $request->content,
            'image' => $imageUrl,
        ]);

        return response()->json($section, 201);
    }


}
