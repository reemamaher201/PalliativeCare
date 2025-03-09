import React from "react";


const ChatPage4 = () => {
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

            {/* محتوى الصفحة (الشريط العلوي، قائمة الدردشات، نافذة المحادثة) */}
            <div className="flex flex-col flex-grow">
                {/* الشريط العلوي */}
                <div className="font-sans">

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
                </div>

                {/* قائمة الدردشات ونافذة المحادثة */}
                <div className="flex flex-grow">
                    {/* قائمة الدردشات */}
                    <div className="w-1/3 border-r border-gray-300 p-4 flex flex-col">
                        <h3 className="text-lg font-bold text-gray-700 mb-4">الدردشات</h3>
                        {/* حقل البحث */}
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="بحث"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                            <span className="absolute top-2 left-3 text-gray-400">
                                <i className="fas fa-search"></i>
                            </span>
                        </div>
                        {/* قائمة المحادثات */}
                        <ul className="space-y-4 overflow-y-auto flex-grow">
                            {[
                                "جمعية الإغاثة الإسلامية",
                                "أحمد المجدي",
                                "أسماء ماهر",
                                "جمعية الإغاثة الإسلامية",
                                "جمعية الإغاثة الإسلامية",
                                "جمعية الإغاثة الإسلامية",
                            ].map((name, index) => (
                                <li key={index} className="border-b pb-2">
                                    <h4 className="font-bold text-gray-700">{name}</h4>
                                    <p className="text-sm text-gray-500">
                                        أنت: الكمية ستتوفر بعد أسبوع من الآن، ونبقى على تواصل.
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* نافذة المحادثة */}
                    <div className="w-2/3 p-4 flex flex-col">
                        {/* عنوان المحادثة */}
                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-lg font-bold text-gray-700">
                                مصطفى أحمد
                            </h3>
                        </div>
                        {/* الرسائل */}
                        <div className="flex flex-col space-y-4 mb-4 overflow-y-auto flex-grow">
                            <div className="self-start bg-gray-200 px-4 py-2 rounded-lg max-w-sm">
                                أهلاً، كيف يمكننا مساعدتك؟
                            </div>
                            <div className="self-end bg-cyan-500 text-white px-4 py-2 rounded-lg max-w-sm">
                                أحتاج إلى مساعدة بخصوص الدواء.
                            </div>
                            <div className="self-start bg-gray-200 px-4 py-2 rounded-lg max-w-sm">
                                بالتأكيد، سنقوم بمساعدتك.
                            </div>
                            <div className="self-end bg-cyan-500 text-white px-4 py-2 rounded-lg max-w-sm">
                                شكراً لكم.
                            </div>
                            <div className="self-start bg-gray-200 px-4 py-2 rounded-lg max-w-sm">
                                هل تحتاج إلى أي مساعدة إضافية؟
                            </div>
                        </div>
                        {/* حقل إدخال الرسائل */}
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="اكتب رسالتك هنا..."
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                            <button
                                className="bg-cyan-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-cyan-600 transition">
                                مراسلة
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage4;