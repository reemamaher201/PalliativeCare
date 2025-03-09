<?php

use App\Http\Controllers\MedicineController;
use App\Http\Controllers\ProviderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout']);
Route::get('/dashboardM', [UserController::class, 'dashboardM']);
Route::get('/user-profile', [UserController::class, 'getUserProfile']);
Route::get('/showprovider',[providerController::class,'showprovider']);
Route::post('/storeprovider',[providerController::class,'storeprovider']);
Route::get('/dashboardS',[providerController::class,'dashboardS']);
Route::get('/showpatient',[UserController::class,'showpatient']);
Route::delete('/deleteprovider/{id}', [ProviderController::class, 'destroy']);
Route::put('/updateprovider/{id}', [ProviderController::class, 'update']);
Route::post('/storepatient', [UserController::class, 'storepatient']);
Route::post('/storemedicine', [MedicineController::class, 'store']);
Route::get('/showmedicines', [MedicineController::class, 'index']);


