<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\FeaturesController;
use App\Http\Controllers\FooterController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Routes المصادقة (لا تتطلب تسجيل الدخول)
Route::post('/register', [AuthController::class, 'register'])->name('auth.register');
Route::post('/login', [AuthController::class, 'login'])->withoutMiddleware('auth:api');

// Routes العامة (لا تتطلب تسجيل الدخول)
Route::get('/show', [SettingController::class, 'show']);
Route::get('/sections', [SectionController::class, 'index']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/features', [FeaturesController::class, 'index']);
Route::get('/fastlink', [FooterController::class, 'indexLink']);
Route::get('/social', [FooterController::class, 'index']);

Route::post('/subscribe', [NewsletterController::class, 'subscribe']);
Route::get('/subscribers', [NewsletterController::class, 'getSubscribers']);
Route::post('/send-newsletter', [NewsletterController::class, 'sendNewsletter']);


// Routes المحمية (تتطلب تسجيل الدخول)
Route::middleware('auth:api')->group(function () {
    // AuthController (تسجيل الخروج)
    Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');

    // UserController (بيانات المستخدم)
    Route::get('/me', [UserController::class, 'me'])->name('user.me');

    // Routes خاصة بالمديرين

    Route::get('/dashboardM', [UserController::class, 'dashboardM'])->name('user.dashboardM');
    Route::get('/showprovider', [ProviderController::class, 'showprovider'])->name('provider.showprovider');
    Route::post('/storeprovider', [ProviderController::class, 'storeprovider'])->name('provider.storeprovider');
    Route::get('/showpatient', [PatientController::class, 'showpatient'])->name('user.showpatient');
    Route::get('admin-dashboard',[AdminDashboardController::class,'show']);

    Route::middleware(['check.user_type:Admin'])->group(function () {
        Route::post('/settings/update', [SettingController::class, 'store']);
        Route::post('/sections', [SectionController::class, 'store']);
        Route::post('/services', [ServiceController::class, 'store']);
        Route::post('/blogs', [BlogController::class, 'store']);
        Route::post('/features', [FeaturesController::class, 'store']);
        Route::post('/fastlink', [FooterController::class, 'storelink']);
        Route::post('/social', [FooterController::class, 'store']);


    });
    Route::post('/patients/approve/{id}', [PatientController::class, 'approvePatientRequest']);
    Route::post('/patients/reject/{id}', [PatientController::class, 'rejectPatientRequest']);
    Route::get('/patients/pending', [PatientController::class, 'getPendingPatientRequests']);
    Route::get('/patient-requests/{id}', [PatientController::class, 'getPatientRequestDetails']);
    Route::get('/med/pending', [ProviderController::class, 'getPendingMedRequests']);
    Route::post('/med/approve/{id}', [ProviderController::class, 'approveMedRequest']);
    Route::post('/med/reject/{id}', [ProviderController::class, 'rejectMedRequest']);
    Route::get('/med-requests/{id}', [ProviderController::class, 'getMedRequestDetails']);

    Route::post('/deletion-requests/{id}/approve', [ProviderController::class, 'approveDeletionRequest']);
    Route::post('/deletion-requests/{id}/reject', [ProviderController::class, 'rejectDeletionRequest']);
    Route::post('/deletion-requestsp/{id}/approve', [ProviderController::class, 'approveDeletionRequestp']);
    Route::post('/deletion-requestsp/{id}/reject', [ProviderController::class, 'rejectDeletionRequestp']);
// لطلبات المرضى
    Route::put('/patient-requests/{id}', [ProviderController::class, 'updatePatientRequest']);
    Route::delete('/patient-requests/{id}', [ProviderController::class, 'deletePatientRequest']);

// لطلبات الأدوية
    Route::put('/med-requests/{id}', [ProviderController::class, 'updateMedRequest']);
    Route::post('/medicines/{id}/request-delete', [ProviderController::class, 'requestDeleteMedicine']);
    Route::post('/patients/{id}/request-delete', [ProviderController::class, 'requestDeletePatient']);



// في ملف routes/api.php
    Route::get('/deletion-requests', [ProviderController::class, 'getDeletionRequests']);
    Route::get('/deletion-requestsp', [ProviderController::class, 'getDeletionRequestsp']);



    // Routes خاصة بمزودي الخدمة
    Route::middleware(['check.user_type:PROVIDER'])->group(function () {
        Route::get('/dashboardS', [ProviderController::class, 'dashboardS'])->name('provider.dashboardS');
        Route::put('/updateprovider/{id}', [ProviderController::class, 'update'])->name('provider.updateprovider');
        Route::delete('/deleteprovider/{id}', [ProviderController::class, 'destroy'])->name('provider.deleteprovider');
        Route::get('/showmedicines', [MedicineController::class, 'index'])->name('medicine.index');
        Route::post('/storemedicine', [MedicineController::class, 'store'])->name('medicine.store');
        Route::put('/updatemedicine/{id}', [MedicineController::class, 'updateMedicine'])->name('medicine.updatemedicine');
        Route::delete('/deletemedicine/{id}', [MedicineController::class, 'destroyMedicine'])->name('medicine.deletemedicine');
        Route::get('/notifications', [NotificationController::class, 'index'])->name('notification.index');
        Route::post('/addnotification', [NotificationController::class, 'store'])->name('notification.store');
        Route::put('/updatenotification/{id}', [NotificationController::class, 'updatenotification'])->name('notification.updatenotification');
        Route::delete('/deletenotification/{id}', [NotificationController::class, 'destroynotification'])->name('notification.deletenotification');
        Route::post('/patients/request', [PatientController::class, 'requestAddPatient']);
        Route::get('/patients/check-identity/{identityNumber}', [PatientController::class, 'checkIdentityNumber']);
        Route::get('/provider/patients', [PatientController::class, 'getProviderPatients']);
        Route::post('/med/request', [ProviderController::class, 'requestAddMed']);
        Route::get('/provider/medicines', [ProviderController::class, 'getProviderMedicines']);
        Route::post('medicines/{id}/request-edit',[ProviderController::class, 'requestEditMedicine']);
        Route::post('patients/{id}/request-edit',[ProviderController::class, 'requestEditPatient']);




    });

    // Routes خاصة بالمرضى
//    Route::middleware(['check.user_type:PATIENT'])->group(function () {
    Route::get('/user-profile', [PatientController::class, 'getUserProfile'])->name('user.profile');
    Route::put('/updatepatient/{id}', [PatientController::class, 'update'])->name('user.updatepatient');
    Route::delete('/deletepatient/{id}', [PatientController::class, 'destroy'])->name('user.deletepatient');
    Route::post('/patients', [PatientController::class, 'store'])->name('patients.store');
    Route::post('/storepatient', [PatientController::class, 'storepatient'])->name('patients.storepatient');
//    });
});


// routes/api.php
Route::post('refresh-token', [AuthController::class, 'refreshToken']);
Route::get('/modification-requests-med', [ProviderController::class, 'index']); // جلب جميع الطلبات
Route::post('/medicine-edit-requests/{id}/approve', [ProviderController::class, 'approve']);
Route::post('/medicine-edit-requests/{id}/reject', [ProviderController::class, 'reject']);

Route::post('/patient-edit-requests/{id}/approve', [ProviderController::class, 'approvep']);
Route::post('/patient-edit-requests/{id}/reject', [ProviderController::class, 'rejectp']);

Route::get('/modification-requests', [ProviderController::class, 'show']); // جلب جميع الطلبات


Route::middleware('auth:api')->group(function () {
    // إرسال رسالة
    Route::post('/send-message', [ChatController::class, 'sendMessage']);

    // الحصول على الرسائل بين مستخدمين
    Route::get('/get-messages/{receiverId}', [ChatController::class, 'getMessages']);

    // الحصول على قائمة المستخدمين للدردشة
    Route::get('/get-chat-users', [ChatController::class, 'getChatUsers']);

    // تحديث حالة المستخدم إلى أونلاين
    Route::post('/set-user-online', [ChatController::class, 'setUserOnline']);

    // تحديث حالة المستخدم إلى أوفلاين
    Route::post('/set-user-offline', [ChatController::class, 'setUserOffline']);
});
