<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LandingPage;

class AdminDashboardController extends Controller {
    public function __construct() {
        $this->middleware('auth:api');
        $this->middleware('admin')->except(['show']);
    }

    // جلب بيانات الصفحة
    public function show() {
        return response()->json(LandingPage::first());
    }

    // تحديث بيانات الصفحة
    public function update(Request $request) {
        $request->validate([
            'title' => 'required|string|max:255',
            'about' => 'required|string',
            'features' => 'required|array',
            'services' => 'required|array',
            'tips' => 'required|array',
            'footer' => 'required|array',
        ]);

        $landingPage = LandingPage::first();
        if (!$landingPage) {
            $landingPage = new LandingPage();
        }

        $landingPage->update($request->all());
        return response()->json(['message' => 'تم تحديث صفحة الهبوط بنجاح', 'data' => $landingPage]);
    }
}

