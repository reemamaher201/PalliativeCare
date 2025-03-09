import React from "react";

const CreateNotification = () => {
    return (
        <div dir={"rtl"} className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-1/4 bg-cyan-700 text-white p-6">
                <h2 className="text-xl font-bold mb-6">لوحة التحكم الرئيسية</h2>
                <ul className="space-y-4">
                    <li className="hover:underline cursor-pointer">المرضى</li>
                    <li className="hover:underline cursor-pointer">الأدوية</li>
                    <li className="hover:underline cursor-pointer">إحصائيات</li>
                    <li className="hover:underline cursor-pointer">مزود الخدمة</li>
                    <li className="hover:underline cursor-pointer">الإشعارات</li>
                </ul>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6">
                {/* Header */}
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">أحمد محمد</h1>
                    <div className="flex space-x-4">
                        <i className="fas fa-bell text-gray-500 text-lg cursor-pointer"></i>
                        <i className="fas fa-envelope text-gray-500 text-lg cursor-pointer"></i>
                    </div>
                </header>

                {/* Notification Creation Form */}
                <section>
                    <h3 className="text-lg font-bold text-cyan-700 mb-6">إنشاء إشعار</h3>
                    <form className="space-y-4">
                        {/* Notification Title */}
                        <div>
                            <input
                                type="text"
                                placeholder="عنوان الإشعار"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>

                        {/* Notification Text */}
                        <div>
              <textarea
                  placeholder="نص الإشعار"
                  rows="4"
                  maxLength="100"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              ></textarea>
                            <p className="text-sm text-gray-500 text-right">0/100 كلمة</p>
                        </div>

                        {/* Notification Date */}
                        <div dir={"rtl"} className="relative">
                            <input
                                type="date"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                            <span className="absolute top-2 right-3 text-gray-400">
                {/*<i className="fas fa-calendar"></i>*/}
              </span>
                        </div>

                        {/* Recipient */}
                        <div>
                            <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                                <option value="">المرسل له</option>
                                <option value="all">الجميع</option>
                                <option value="patients">المرضى</option>
                                <option value="providers">مزودو الخدمة</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="bg-cyan-700 text-white px-6 py-2 rounded-lg hover:bg-cyan-800 transition"
                            >
                                إرسال
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default CreateNotification;