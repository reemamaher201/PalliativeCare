import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './component/Sidebar'; // استيراد السايدبار
import Navbar from './component/Navbar';
import {useNavigate} from "react-router-dom"; // استيراد الناف بار

const ReqAddPatient = () => {
    const [patientData, setPatientData] = useState({
        identity_number: '',
        name: '',
        address: '',
        birth_date: '',
        care_type: '',
        gender: '',
        phoneNumber: '',
    });

    const [loading, setLoading] = useState(false); // حالة التحميل
    const [error, setError] = useState(""); // حالة الخطأ العام
    const [identityError, setIdentityError] = useState(""); // حالة الخطأ لرقم الهوية
    const navigate = useNavigate(); // تهيئة useNavigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatientData({ ...patientData, [name]: value });

        // التحقق من رقم الهوية عند تغيير القيمة
        if (name === 'identity_number') {
            checkIdentityNumber(value);
        }
    };

    const checkIdentityNumber = async (identityNumber) => {
        if (identityNumber.trim() === "") {
            setIdentityError(""); // إعادة تعيين الخطأ إذا كان الحقل فارغًا
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://127.0.0.1:8000/api/patients/check-identity/${identityNumber}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Response Data:", response.data); // تحقق من البيانات

            if (response.data.exists) {
                setIdentityError("رقم الهوية موجود مسبقًا.");
            } else {
                setIdentityError(""); // إعادة تعيين الخطأ إذا كان الرقم غير موجود
            }
        } catch (error) {
            console.error('Error checking identity number:', error);
            setIdentityError("حدث خطأ أثناء التحقق من رقم الهوية.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // التحقق من وجود خطأ في رقم الهوية قبل الإرسال
        if (identityError) {
            alert("يوجد خطأ في رقم الهوية. يرجى تصحيحه قبل الإرسال.");
            return;
        }

        setLoading(true); // بدء التحميل
        setError(""); // إعادة تعيين حالة الخطأ العام

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://127.0.0.1:8000/api/patients/request', patientData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert(response.data.message);
            navigate('/provider/patients'); // إعادة التوجيه إلى صفحة المرضى

        } catch (error) {
            console.error('Error adding patient:', error);
            setError('حدث خطأ أثناء إضافة المريض.');
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
                        <h2 className="text-2xl font-semibold mb-8 text-center text-cyan-700">إضافة مريض جديد</h2>
                        {error && (
                            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهوية</label>
                                    <input
                                        type="text"
                                        name="identity_number"
                                        placeholder="رقم الهوية"
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                    {identityError && (
                                        <p className="text-red-500 text-sm mt-1">{identityError}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="الاسم"
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        placeholder="رقم الجوال"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الميلاد</label>
                                    <input
                                        type="date"
                                        name="birth_date"
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">نوع الرعاية</label>
                                    <input
                                        type="text"
                                        name="care_type"
                                        placeholder="نوع الرعاية"
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">الجنس</label>
                                    <select
                                        name="gender"
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    >
                                        <option value="">اختر الجنس</option>
                                        <option value="male">ذكر</option>
                                        <option value="female">أنثى</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-cyan-700 text-white p-3 rounded-lg hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                disabled={loading || identityError} // تعطيل الزر أثناء التحميل أو وجود خطأ في رقم الهوية
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

export default ReqAddPatient;