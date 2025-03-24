<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Section;
use Illuminate\Support\Facades\Storage;

class SectionController extends Controller
{
    // جلب جميع الأقسام
    public function index()
    {
        $sections = Section::all();
        return response()->json($sections);
    }

    // إضافة قسم جديد
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // حفظ الصورة في المجلد العام (public)
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->storePublicly('images', 'public');
            $imageUrl = url(Storage::url($imagePath)); // إنشاء رابط URL كامل

        } else {
            $imageUrl = null;
        }

        // إنشاء قسم جديد
        $section = Section::create([
            'title' => $request->title,
            'content' => $request->content,
            'image' => $imageUrl, // حفظ رابط URL كامل
        ]);

        return response()->json($section, 201);
    }


}
