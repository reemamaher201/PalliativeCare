<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
// جلب الإعدادات
public function index()
{
$settings = Setting::first();
return response()->json($settings);
}

// حفظ التعديلات
public function store(Request $request)
{
$request->validate([
'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
'imgabout' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
'main_heading' => 'nullable|string',
'main_text' => 'nullable|string',
'footer_text' => 'nullable|string',
'background_color' => 'nullable|string',
'button_color' => 'nullable|string',
]);

$settings = Setting::firstOrNew();

// حفظ الصورة في المجلد العام (public)
if ($request->hasFile('logo')) {
$logoPath = $request->file('logo')->store('public/images');
$settings->logo = Storage::url($logoPath); // حفظ رابط الصورة
}

if ($request->hasFile('imgabout')) {
$imgaboutPath = $request->file('imgabout')->store('public/images');
$settings->imgabout = Storage::url($imgaboutPath); // حفظ رابط الصورة
}

$settings->main_heading = $request->main_heading;
$settings->main_text = $request->main_text;
$settings->footer_text = $request->footer_text;
$settings->background_color = $request->background_color;
$settings->button_color = $request->button_color;
$settings->save();

return response()->json($settings, 201);
}
}
