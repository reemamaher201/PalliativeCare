import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProvider = () => {
    const [providerData, setProviderData] = useState({
        name: "",
        username: "",
        password: "",
        email: "",
        phoneNumber: "",
        identity_number:""
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setProviderData({ ...providerData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://127.0.0.1:8000/api/storeprovider", providerData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess("تمت إضافة المزود بنجاح!");
            navigate("/showprovider"); // الانتقال إلى صفحة المزودين بعد الإضافة
        } catch (err) {
            setError(err.response?.data?.message || "حدث خطأ أثناء إضافة المزود.");
        }
    };

    return (
        <div dir={"rtl"} className="flex min-h-screen bg-gray-100">
            {/* الشريط الجانبي */}
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

            {/* المحتوى الرئيسي */}
            <main className="flex-1 p-6">
                {/* الشريط العلوي */}
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">أحمد محمد</h1>
                    <div className="flex space-x-4 space-x-reverse">
                        <i className="fas fa-bell text-gray-500 text-lg cursor-pointer"></i>
                        <i className="fas fa-envelope text-gray-500 text-lg cursor-pointer"></i>
                    </div>
                </header>

                {/* نموذج إضافة مزود جديد */}
                <section>
                    <h3 className="text-lg font-bold text-cyan-700 mb-6">إضافة مزود جديد</h3>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* اسم المزود */}
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={providerData.name}
                                onChange={handleChange}
                                placeholder="اسم المزود"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>

                        {/* اسم المستخدم */}
                        <div>
                            <input
                                type="text"
                                name="username"
                                value={providerData.username}
                                onChange={handleChange}
                                placeholder="اسم المستخدم"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>

                        {/* كلمة المرور */}
                        <div>
                            <input
                                type="password"
                                name="password"
                                value={providerData.password}
                                onChange={handleChange}
                                placeholder="الرقم السري"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>

                        {/* البريد الإلكتروني */}
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={providerData.email}
                                onChange={handleChange}
                                placeholder="البريد الإلكتروني للتواصل"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                        <div>
                            {/* رقم الجوال */}
                            <input
                                type="text"
                                name="phoneNumber"
                                value={providerData.phoneNumber}
                                onChange={handleChange}
                                placeholder="رقم الجوال للتواصل"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                        <div>
                            {/* رقم الهوية */}
                            <input
                                type="text"
                                name="identity_number"
                                value={providerData.identity_number}
                                onChange={handleChange}
                                placeholder="رقم هوية المسؤول"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>

                        {/* زر الإضافة */}
                        <div>
                            <button
                                type="submit"
                                className="bg-cyan-700 text-white px-6 py-2 rounded-lg hover:bg-cyan-800 transition"
                            >
                                إضافة
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default AddProvider;