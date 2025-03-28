<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
public function index()
{
$services = Service::all();
return response()->json($services);
}

public function store(Request $request)
{
$request->validate([
'title' => 'required|string|max:255',
'content' => 'nullable|string',
'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
]);

if ($request->hasFile('image')) {
    $imagePath = $request->file('image')->storePublicly('images', 'public');
$imageUrl = url(Storage::url($imagePath));

} else {
    $imageUrl = null;
}

$service = Service::create([
'title' => $request->title,
'content' => $request->content,
'image' => $imageUrl,
]);

return response()->json($service, 201);
}
}
