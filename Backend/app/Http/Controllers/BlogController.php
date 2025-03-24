<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::all();
        return response()->json($blogs);
    }

    // إضافة قسم جديد
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'link' => 'nullable|url',
        ]);

        // إنشاء قسم جديد
        $blog = Blog::create([
            'title' => $request->title,
            'content' => $request->content,
            'link' => $request->link,
        ]);

        return response()->json($blog, 201);
    }

}
