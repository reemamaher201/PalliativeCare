import React from "react";
import PNavbar from "./PNavbar.jsx";

const NotificationsPage = () => {
    return (
        <div className=" min-h-screen ">
            {/* شريط التنقل */}
            <div className="font-sans">
                <PNavbar />
            </div>
            <div className="container mx-auto bg-white shadow-lg rounded-lg p-6">
                {/* العنوان الرئيسي */}
                <h2 className="text-cyan-700 text-2xl font-bold text-center mb-8">
                    الإشعارات
                </h2>

                {/* قائمة الإشعارات */}
                <div className="space-y-4">
                    {/* إشعار */}
                    <div className="bg-gray-200 p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-gray-700 mb-2">إشعار</h3>
                        <p className="text-gray-700">
                            تم تحديث إعدادات حسابك بنجاح. تأكد من مراجعة التغييرات الجديدة
                            للحفاظ على أمان الحساب. إذا كنت بحاجة إلى أي مساعدة، لا تتردد في
                            الاتصال بفريق الدعم.
                        </p>
                    </div>

                    {/* نصيحة مهمة */}
                    <div className="bg-green-100 p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-green-700 mb-2">نصيحة مهمة</h3>
                        <p className="text-gray-700">
                            لضمان تقديم أفضل خدمة، تأكد من تحديث بياناتك بشكل دوري. كما يُفضل
                            متابعة المخزون بانتظام لتجنب نقص الأدوية أو الموارد.
                        </p>
                    </div>

                    {/* تنبيه */}
                    <div className="bg-red-100 p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-red-700 mb-2">تنبيه</h3>
                        <p className="text-gray-700">
                            تقرّب بعض الأدوية في مخزونك من تاريخ الانتهاء الصلاحي. يُرجى
                            التحقق من الكميات المتبقية واتخاذ الإجراءات المناسبة قبل انتهاء
                            الصلاحية المحددة.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;