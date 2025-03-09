import React from "react";
import PNavbar from "./PNavbar.jsx";

const ChatPage = () => {
    return (
        <div dir="rtl" className="min-h-screen flex flex-col">
            {/* شريط التنقل */}
            <div className="font-sans">
                <PNavbar />
            </div>
            <div className="container mx-auto bg-white shadow-lg rounded-lg flex flex-grow">
                {/* قائمة الدردشات */}
                <div className="w-1/3 border-r border-gray-300 p-4 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">الدردشات</h3>
                    {/* البحث */}
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
                        <li className="border-b pb-2">
                            <h4 className="font-bold text-gray-700">جمعية الإغاثة الإسلامية</h4>
                            <p className="text-sm text-gray-500">
                                أنت: الدحية ستتوفر بعد أسبوع من الآن ونبقى على تواصل.
                            </p>
                        </li>
                        <li className="border-b pb-2">
                            <h4 className="font-bold text-gray-700">جمعية الإغاثة الإسلامية</h4>
                            <p className="text-sm text-gray-500">
                                أنت: الدحية ستتوفر بعد أسبوع من الآن ونبقى على تواصل.
                            </p>
                        </li>
                        <li className="border-b pb-2">
                            <h4 className="font-bold text-gray-700">جمعية الإغاثة الإسلامية</h4>
                            <p className="text-sm text-gray-500">
                                أنت: الدحية ستتوفر بعد أسبوع من الآن ونبقى على تواصل.
                            </p>
                        </li>
                        <li className="border-b pb-2">
                            <h4 className="font-bold text-gray-700">جمعية الإغاثة الإسلامية</h4>
                            <p className="text-sm text-gray-500">
                                أنت: الدحية ستتوفر بعد أسبوع من الآن ونبقى على تواصل.
                            </p>
                        </li>
                        <li className="border-b pb-2">
                            <h4 className="font-bold text-gray-700">جمعية الإغاثة الإسلامية</h4>
                            <p className="text-sm text-gray-500">
                                أنت: الدحية ستتوفر بعد أسبوع من الآن ونبقى على تواصل.
                             </p>
                        </li>
                        <li className="border-b pb-2">
                            <h4 className="font-bold text-gray-700">جمعية الإغاثة الإسلامية</h4>
                            <p className="text-sm text-gray-500">
                                أنت: الدحية ستتوفر بعد أسبوع من الآن ونبقى على تواصل.
                            </p>
                        </li>
                        <li className="border-b pb-2">
                            <h4 className="font-bold text-gray-700">جمعية الإغاثة الإسلامية</h4>
                            <p className="text-sm text-gray-500">
                                أنت: الدحية ستتوفر بعد أسبوع من الآن ونبقى على تواصل.
                            </p>
                        </li>
                       
                        {/* يمكن إضافة المزيد من المحادثات هنا */}
                    </ul>
                </div>

                {/* نافذة المحادثة */}
                <div className="w-2/3 p-4 flex flex-col">
                    {/* عنوان المحادثة */}
                    <div className="border-b pb-4 mb-4">
                        <h3 className="text-lg font-bold text-gray-700">
                            جمعية الصليب الأحمر الفلسطيني
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
                            أحتاج إلى مساعدة بخصوص الدواء.
                        </div>
                        <div className="self-start bg-gray-200 px-4 py-2 rounded-lg max-w-sm">
                            بالتأكيد، سنقوم بمساعدتك.
                        </div>
                        <div className="self-end bg-cyan-500 text-white px-4 py-2 rounded-lg max-w-sm">
                            أحتاج إلى مساعدة بخصوص الدواء.
                        </div>
                    </div>
                    {/* حقل إدخال الرسائل */}
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="اكتب رسالتك هنا..."
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-cyan-600 transition">
                            مراسلة
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;