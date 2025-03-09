<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class ProviderController extends Controller
{
    public function showprovider()
    {
        // جلب المزودين مع المستخدمين المرتبطين بهم، وتحديد نوع المستخدم = 1 (مزود)
        $providers = Provider::with('user:id,name')
            ->whereHas('user', function ($query) {
                $query->where('user_type', 1);
            })
            ->get();

        // تحويل البيانات إلى التنسيق المطلوب
        $result = $providers->map(function ($provider) {
            return [
                'id' => $provider->id,
                'name' => $provider->user->name, // من جدول users
                'username' => $provider->username, // من جدول providers
                'email' => $provider->email, // من جدول providers
                'user_id' => $provider->user->id, // من جدول users
                'phoneNumber'=> $provider->phoneNumber,
                'created_at' => $provider->created_at, // من جدول providers
                'updated_at' => $provider->updated_at, // من جدول providers
            ];
        });

        return response()->json($result->values());
    }


    public function storeprovider(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'identity_number' => 'required|unique:users',
            'username' => 'required|unique:providers',
            'password' => 'required',
            'phoneNumber' => 'required|numeric|digits:10',
            'email' => 'required|email|unique:providers',
            'address' => 'nullable|string',
        ]);

        // إنشاء المستخدم
        $user = User::create([
            'name' => $request->name,
            'user_type' => 1,
            'identity_number' => $request->identity_number,
            'phoneNumber' => $request->phoneNumber,
            'password' => Hash::make($request->password),
            'address' => $request->address,
        ]);

        // إنشاء المزود وربطه بالمستخدم
        try {
            $provider = Provider::create([
                'user_id' => $user->id,
                'name' => $request->name,
                'identity_number' => $request->identity_number,
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'phoneNumber' => $request->phoneNumber,
                'email' => $request->email,
                'address' => $request->address,
            ]);

            return response()->json(['message' => 'تم تسجيل المزود بنجاح', 'provider' => $provider], 201);

        } catch (\Exception $e) {
            // تسجيل الخطأ أو عرضه
            dd($e->getMessage()); // سيوقف التنفيذ ويعرض رسالة الخطأ
            // أو يمكنك إرجاع استجابة خطأ JSON
            // return response()->json(['message' => 'حدث خطأ أثناء تسجيل المزود', 'error' => $e->getMessage()], 500);
        }
    }


    public function dashboardS()
    {
        try {
            // فحص رمز JWT واسترجاع المستخدم المصادق عليه
            $user = JWTAuth::parseToken()->authenticate();

            // الآن لديك المستخدم المصادق عليه من الرمز
            // يمكنك الوصول إلى بيانات المستخدم باستخدام $user->id, $user->name, $user->email, إلخ.

            // ابحث عن المزود بناءً على user_id
            $provider = Provider::where('user_id', $user->id)->first();

            // التأكد من وجود المزود
            if (!$provider) {
                return response()->json(['message' => 'Provider not found'], 404);
            }

            // إرجاع بيانات المزود
            return response()->json([
                'id' => $provider->id,
                'name' => $provider->name,
                'email' => $provider->email,
                'phoneNumber' => $provider->phoneNumber,
                // يمكنك إضافة المزيد من البيانات التي تريد إرجاعها
            ]);

        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid Token'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token is Expired'], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            // فحص رمز JWT واسترجاع المستخدم المصادق عليه
            $authUser = JWTAuth::parseToken()->authenticate();

            // فحص نوع المستخدم (تغيير الشرط إلى 0)
            if ($authUser->user_type !== 0) {
                DB::rollBack();
                return response()->json(['message' => 'غير مصرح لك بحذف المزودين'], 403);
            }

            $provider = Provider::find($id);

            if (!$provider) {
                DB::rollBack();
                return response()->json(['message' => 'لم يتم العثور على المزود'], 404);
            }

            $user = User::find($provider->user_id);

            if (!$user) {
                DB::rollBack();
                return response()->json(['message' => 'لم يتم العثور على المستخدم المرتبط بالمزود'], 404);
            }

            // حذف المزود أولاً
            $provider->delete();

            // ثم حذف المستخدم
            $user->delete();

            DB::commit();
            return response()->json(['message' => 'تم حذف المزود والمستخدم بنجاح']);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error deleting provider: " . $e->getMessage());
            return response()->json(['message' => 'حدث خطأ أثناء الحذف: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $provider = Provider::find($id);
        if ($provider) {
            $provider->update($request->all());
            return response()->json(['message' => 'تم تحديث المزود بنجاح']);
        }
        return response()->json(['message' => 'لم يتم العثور على المزود'], 404);
    }
}
