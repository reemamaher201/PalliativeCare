<?php

namespace App\Http\Controllers;

use App\Models\FastLink;
use App\Models\Social;
use Illuminate\Http\Request;

class FooterController extends Controller
{

    public function index()
    {
        $social = Social::all();
        if ($social->isNotEmpty()) {
            return response()->json($social);
        } else {
            return response()->json(['message' => 'لا يوجد رابط تواصل متاح'], 404);
        }
    }
    public function indexLink()
    {
        $fastLinks = FastLink::all();
        if ($fastLinks->isNotEmpty()) {
            return response()->json($fastLinks);
        } else {
            return response()->json(['message' => 'لا توجد روابط سريعة متاحة'], 404);
        }
    }
    public function store(Request $request)
    {
        try {
            $request->validate([
                'social' => 'required|string',
            ]);

            $social = Social::create([
                'social' => $request->social,
            ]);

            return response()->json($social, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function storelink(Request $request)
    {
        try {
            $request->validate([
                'title_ar' => 'required|string',
                'title_en' => 'required|string',
                'link' => 'required|string',
            ]);

            $link = FastLink::create([
                'title_ar'=>$request->title_ar,
                'title_en'=>$request->title_en,

                'link' => $request->link,
            ]);

            return response()->json($link, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

}
