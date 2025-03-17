<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'phoneNumber' => 'required|string|unique:users',
            'identity_number' => 'required|string|unique:users',
            'password' => 'required|string|min:8',
            'address' => 'required|string',
            'user_type' => 'required|integer',
        ]);

        $user = User::create([
            'name' => $request->name,
            'phoneNumber' => $request->phoneNumber,
            'identity_number' => $request->identity_number,
            'password' => Hash::make($request->password),
            'address' => $request->address,
            'user_type' => $request->user_type,
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('identity_number', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $user = JWTAuth::user();

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json(['message' => 'Logout successful']);
    }
}
