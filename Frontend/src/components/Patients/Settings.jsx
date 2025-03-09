import React from "react";
import PNavbar from "./PNavbar.jsx";

const Settings = () => {
    return (
        <div className="bg-white max-h-screen">
            {/* شريط التنقل */}
            <div className="font-sans">
                <PNavbar />
            </div>

            <div dir={"rtl"} className=" min-h-screen p-8">
                <div className="container mx-auto bg-white shadow-lg rounded-lg p-6">
                    {/* العنوان الرئيسي */}
                    <h2 className="text-cyan-700 text-2xl font-bold text-center mb-8">
                        إعدادات الحساب
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* القسم الأول: إعدادات الحساب */}
                        <div>
                            <h3 className="text-lg font-bold text-cyan-700 mb-4">إعدادات الحساب</h3>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-right mb-2">الاسم</label  >            <input
                                type="text"
                                value="أحمد محمد محمود"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                readOnly
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-right mb-2">رقم الهوية</label >             <input
                                type="text"
                                value="924310875"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                readOnly
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-right mb-2">العمر</label >             <input
                                type="text"
                                value="40 سنة"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                readOnly
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-right mb-2">الجنس</label  >            <div className="flex items-center space-x-4 space-x-reverse">
                                <label className="flex items-center space-x-2 space-x-reverse">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="ذكر"
                                        className="form-radio h-5 w-5 text-cyan-500 border-gray-300 focus:ring-cyan-500"
                                        checked
                                        readOnly
                                    />
                                    <span className="text-gray-700">ذكر</span>
                                </label >               <label className="flex items-center space-x-2 space-x-reverse">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="أنثى"
                                    className="form-radio h-5 w-5 text-cyan-500 border-gray-300 focus:ring-cyan-500"
                                    readOnly
                                />
                                <span className="text-gray-700">أنثى</span>
                            </label   >           </div>
                    </div>
                </div>

                {/* القسم الثاني: إعدادات السكن */}
                <div>
                    <h3 className="text-lg font-bold text-cyan-700 mb-4">إعدادات السكن</h3>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-right mb-2">منطقة السكن</label  >            <input
                        type="text"
                        placeholder="النصر/ستار سنس مول"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-right mb-2">أقرب مزود</label  >            <input
                        type="text"
                        placeholder="الإغاثة الطبية"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-right mb-2">رقم الهاتف</label >             <input
                        type="text"
                        placeholder="0594301287"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-right mb-2">رقم هاتف الطوارئ</label>          <input
                        type="text"
                        placeholder="05654302218"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                </div>
            </div>

                    {/* ضبط الإشعارات */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-cyan-700 mb-4">ضبط الإشعارات</h3>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4 space-x-reverse">
                                <span className="text-gray-700">كتم صوت الإشعارات</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type ="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:bg-cyan-500"></div>
 <span className="ml-3 text-sm font-medium text-gray-700">غير مفعل</span>
 </label >       </div>
 </div>
 <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
            <span className="text-gray-700">كتم صوت الدردشات</span>
 <label className="relative inline-flex items-center cursor-pointer">
                <input type ="checkbox" className="sr-only peer" checked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:bg-cyan-500"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-700">مفعل</span>
                                </label >       </div>
                        </div>

            {/* تغيير اللغة والمنطقة الزمنية */}
            <div className="mt-8">
                <h3 className="text-lg font-bold text-cyan-700 mb-4">تغيير اللغة والمنطقة الزمنية</h3>
                <div className="mb-4">
                    <label className="block text-gray-700 text-right mb-2">تغيير اللغة</label  >          <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="ar">العربية</option >             <option value="en">English</option  >          </select >         </div>
    <div>
        <label className="block text-gray-700 text-right mb-2">المنطقة الزمنية</label >           <input
        type="text"
        placeholder="القدس: 12:00 ص"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
    </div>
</div>

    {/* زر حفظ التغييرات */}
    <div className="mt-8 text-center">
        <button className="bg-cyan-700 text-white px-6 py-2 rounded-lg hover:bg-cyan-800 transition">
            حفظ التغييرات
        </button  >      </div>
</div>
</div>
            </div>
        </div>
    );
};

export default Settings;