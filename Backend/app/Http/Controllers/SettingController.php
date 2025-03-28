<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function show()
    {
        $settings = Setting::first();
        return response()->json($settings);
    }

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

        $settings = Setting::firstOrCreate([]);

        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('images', 'public');
            $settings->logo = url('storage/images/' . basename($logoPath));
        }

        if ($request->hasFile('imgabout')) {
            $imgaboutPath = $request->file('imgabout')->store('images', 'public');
            $settings->imgabout = url('storage/images/' . basename($imgaboutPath));
        }

        $settings->fill($request->except(['logo', 'imgabout']));
        $settings->save();

        return response()->json($settings, 201);
    }
}
