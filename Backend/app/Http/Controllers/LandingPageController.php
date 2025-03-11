<?php

namespace App\Http\Controllers;

use App\Models\LandingPage;
use Illuminate\Http\Request;

class LandingPageController extends Controller
{
    public function index()
    {
        $landingPage = LandingPage::firstOrCreate([]);
        return response()->json($landingPage);
    }

    public function update(Request $request)
    {
        $landingPage = LandingPage::firstOrCreate([]);
        $landingPage->update($request->all());
        return response()->json(['message' => 'تم التحديث بنجاح']);
    }

    public function uploadImage(Request $request)
    {
        $path = $request->file('image')->store('uploads', 'public');
        return response()->json(['imageUrl' => asset("storage/{$path}")]);
    }
}
