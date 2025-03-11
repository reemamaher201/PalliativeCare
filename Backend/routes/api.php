<?php

use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

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
Route::put('/updatepatient/{id}', [UserController::class, 'update']);
Route::delete('/deletepatient/{id}', [UserController::class, 'destroy']);

Route::delete('/deletemedicine/{id}', [UserController::class, 'destroyMedicine']);
Route::put('/updatemedicine/{id}', [UserController::class, 'updateMedicine']);




Route::get('/notifications', [NotificationController::class, 'index']);
Route::post('/addnotification', [NotificationController::class, 'store']);

//Route::middleware(['auth:api', 'isAdmin'])->group(function () {
//    Route::get('/landing-page', [LandingPageController::class, 'index']); // جلب البيانات
//    Route::post('/sections', [LandingPageController::class, 'store']); // إضافة قسم جديد
//    Route::put('/sections/{id}', [LandingPageController::class, 'update']); // تعديل قسم
//    Route::delete('/sections/{id}', [LandingPageController::class, 'destroy']); // حذف قسم
//});
Route::get('/landing-page', [LandingPageController::class, 'index']);
Route::post('/admin/landing-page', [LandingPageController::class, 'update']);
Route::post('/admin/upload-image', [LandingPageController::class, 'uploadImage']);

Route::get('/settings', [SettingController::class, 'index']);
Route::post('/settings/update', [SettingController::class, 'store']);
Route::get('/sections', [SectionController::class, 'index']);
Route::post('/sections', [SectionController::class, 'store']);

Route::get('/services', [ServiceController::class, 'index']);
Route::post('/services', [ServiceController::class, 'store']);
