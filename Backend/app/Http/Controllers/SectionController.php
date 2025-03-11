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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // تحقق من أن الملف صورة
        ]);

        // حفظ الصورة في المجلد العام (public)
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
        } else {
            $imagePath = null;
        }

        // إنشاء قسم جديد
        $section = Section::create([
            'title' => $request->title,
            'content' => $request->content,
            'image' => $imagePath ? Storage::url($imagePath) : null, // حفظ رابط الصورة
        ]);

        return response()->json($section, 201);
    }
}
