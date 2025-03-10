<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LandingPage;
use Illuminate\Support\Facades\Validator;

class AdminDashboardController extends Controller
{
    // عرض بيانات صفحة الهبوط
    public function getLandingPage()
    {
        $landingPage = LandingPage::first();
        return response()->json($landingPage);
    }

    // تحديث بيانات صفحة الهبوط
    public function updateLandingPage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'sections' => 'nullable|array',
            'colors' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $landingPage = LandingPage::firstOrNew([]);

        // تحديث البيانات
        $landingPage->title = $request->input('title');
        $landingPage->description = $request->input('description');
        $landingPage->sections = $request->input('sections');
        $landingPage->colors = $request->input('colors');

        // تحديث الصورة إذا تم تحميلها
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('landing_images', 'public');
            $landingPage->image = $imagePath;
        }

        $landingPage->save();

        return response()->json(['message' => 'تم تحديث صفحة الهبوط بنجاح']);
    }
}
