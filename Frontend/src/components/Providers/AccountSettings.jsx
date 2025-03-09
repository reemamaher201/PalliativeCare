import React from "react";

const AccountSettings = () => {
    return (
        <div dir="rtl" className="min-h-screen flex">
            {/* الشريط الجانبي */}
            <aside className="w-1/4 bg-cyan-700 text-white p-6">
                <h2 className="text-xl font-bold mb-6">لوحة التحكم الرئيسية</h2>
                <ul className="space-y-4">
                    <li className="hover:underline cursor-pointer">إدارة الحالات</li>
                    <li className="hover:underline cursor-pointer">إدارة مخزون الأدوية</li>
                    <li className="hover:underline cursor-pointer">إعدادات الحساب</li>
                </ul>
            </aside>
            {/* محتوى الصفحة */}
            <div className="flex flex-col flex-grow">
                {/* الشريط العلوي */}
                <header className="flex justify-between items-center mb-6 px-4 py-2 bg-white shadow-md">
                    {/* اسم الجمعية */}
                    <h1 className="text-xl font-bold">جمعية الصليب الأحمر الفلسطيني</h1>

                    {/* الأيقونات */}
                    <div className="flex items-center space-x-4 space-x-reverse">
                        {/* أيقونة تسجيل الخروج */}
                        <button className="text-blue-500 hover:text-blue-700">
                            <i className="fas fa-sign-out-alt text-xl"></i>
                        </button>
                        {/* أيقونة الإشعارات */}
                        <button className="relative text-blue-500 hover:text-blue-700">
                            <i className="fas fa-bell text-xl"></i>
                            <span
                                className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center"></span>
                        </button>
                        {/* أيقونة الرسائل */}
                        <button className="text-blue-500 hover:text-blue-700">
                            <i className="fas fa-comment-dots text-xl"></i>
                        </button>
                    </div>
                </header>
                {/* إعدادات الحساب */}
                <div className="p-6">
                    <h2 className="text-xl font-bold text-cyan-700 mb-6">إعدادات الحساب</h2>

                    {/* معلومات شخصية */}
                    <div className="mb-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-700 mb-4">معلومات شخصية</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-600 mb-2">اسم المؤسسة</label>
                                    <input
                                        type="text"
                                        value="جمعية الصليب الأحمر الفلسطيني"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-2">اسم المستخدم</label>
                                    <input
                                        type="text"
                                        value="220324112"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-2">البريد الإلكتروني</label>
                                    <input
                                        type="email"
                                        value="name@example.com"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* إعدادات الأمان */}
                    <div className="mb-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-700 mb-4">إعدادات الأمان</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-600 mb-2">الكلمة الحالية</label>
                                    <input
                                        type="password"
                                        value="12345678*"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-2">الكلمة الجديدة</label>
                                    <input
                                        type="password"
                                        placeholder="أدخل الكلمة الجديدة"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-2">تأكيد الكلمة</label>
                                    <input
                                        type="password"
                                        placeholder="أعد إدخال الكلمة الجديدة"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* إعدادات عامة */}
                    <div className="mb-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-700 mb-4">إعدادات عامة</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-600 mb-2">اختيار اللغة</label>
                                    <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                                        <option>العربية</option>
                                        <option>English</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-2">المنطقة الزمنية</label>
                                    <input
                                        type="text"
                                        value="القدس: 12:00 م"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* الأزرار */}
                    <div className="flex justify-between">
                        <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition">
                            حذف الحساب
                        </button>
                        <button className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition">
                            حفظ التغييرات
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;