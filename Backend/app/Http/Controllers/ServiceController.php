<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
// جلب جميع الخدمات
public function index()
{
$services = Service::all();
return response()->json($services);
}

// إضافة خدمة جديدة
public function store(Request $request)
{
$request->validate([
'title' => 'required|string|max:255',
'content' => 'nullable|string',
'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // تحقق من أن الملف صورة
]);

// حفظ الصورة في المجلد العام (public)
if ($request->hasFile('image')) {
    $imagePath = $request->file('image')->storePublicly('images', 'public');
$imageUrl = url(Storage::url($imagePath)); // إنشاء رابط URL كامل

} else {
    $imageUrl = null;
}

// إنشاء خدمة جديدة
$service = Service::create([
'title' => $request->title,
'content' => $request->content,
'image' => $imageUrl, // حفظ رابط الصورة
]);

return response()->json($service, 201);
}
}
