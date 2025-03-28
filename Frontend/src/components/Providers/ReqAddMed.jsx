import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // استيراد useNavigate
import Sidebar from './component/Sidebar'; // استيراد السايدبار
import Navbar from './component/proNavbar.jsx'; // استيراد الناف بار

const ReqAddMed = () => {
    const [medData, setMedData] = useState({
        name: '',
        address: '',
        delivery_date: '',
        type: '',
        quantity: '',
        description: ''
    });

    const [loading, setLoading] = useState(false); // حالة التحميل
    const [error, setError] = useState(""); // حالة الخطأ العام
    const navigate = useNavigate(); // تهيئة useNavigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMedData({ ...medData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true); // بدء التحميل
        setError(""); // إعادة تعيين حالة الخطأ العام

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://127.0.0.1:8000/api/med/request', medData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert(response.data.message); // عرض رسالة نجاح
            navigate('/provider/medicines'); // إعادة التوجيه إلى صفحة المرضى
        } catch (error) {
            console.error('Error adding Medicine:', error);
            setError('حدث خطأ أثناء إضافة الدواء.');
        } finally {
            setLoading(false); // إيقاف التحميل
        }
    };

    // عرض رسالة التحميل
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                <p className="mt-4 text-lg font-semibold text-cyan-500">جاري إرسال الطلب...</p>
            </div>
        );
    }

    return (
        <div dir="rtl" className="flex min-h-screen bg-gray-100">
            {/* الشريط الجانبي */}
            <Sidebar />

            {/* المحتوى الرئيسي */}
            <main className="flex-1">
                {/* الناف بار */}
                <Navbar />

                {/* محتوى الصفحة */}
                <div className="flex items-center justify-center mt-8">
                    <div className="p-8 rounded shadow-md w-full max-w-4xl bg-white">
                        <h2 className="text-2xl font-semibold mb-8 text-center text-cyan-700">إضافة دواء جديد</h2>
                        {error && (
                            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم الدواء</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="اسم الدواء"
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">نوع المرض</label>
                                    <input
                                        type="text"
                                        name="type"
                                        placeholder="نوع المرض"
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">الكمية المتوافرة</label>
                                    <input
                                        type="text"
                                        name="quantity"
                                        placeholder="الكمية المتوافرة"
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="العنوان"
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ التسليم</label>
                                    <input
                                        type="date"
                                        name="delivery_date"
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">وصف الدواء</label>
                                    <input
                                        type="text"
                                        name="description"
                                        placeholder="وصف الدواء"
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-cyan-700 text-white p-3 rounded-lg hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                disabled={loading}
                            >
                                {loading ? "جاري الإرسال..." : "إرسال الطلب"}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReqAddMed;