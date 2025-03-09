import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const AddPatient = () => {
    const [patientData, setPatientData] = useState({
        name: "",
        identity_number: "",
        birth_date: "",
        phoneNumber: "",
        address: "", // إضافة حقل العنوان
        care_type: "", // إضافة حقل نوع الرعاية
        gender: "", // إضافة حقل الجنس
        password: "", // إضافة حقل كلمة المرور
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setPatientData({ ...patientData, [e.target.name]: e.target.value });
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setError(null);
    //     setSuccess(null);
    //
    //     // التحقق من أن رقم الهاتف ليس فارغًا
    //     if (!patientData.phone_number) {
    //         setError("الرجاء إدخال رقم الهاتف.");
    //         return;
    //     }
    //
    //     try {
    //         const token = localStorage.getItem("token");
    //         await axios.post("http://127.0.0.1:8000/api/storepatient", patientData, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         setSuccess("تمت إضافة المريض بنجاح!");
    //         navigate("/showpatient");
    //     } catch (err) {
    //         setError(err.response?.data?.message || "حدث خطأ أثناء إضافة المريض.");
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // تحويل تنسيق التاريخ إلى YYYY-MM-DD (إذا كان التاريخ بتنسيق آخر)
        const formattedBirthDate = moment(patientData.birth_date).format('YYYY-MM-DD');


        try {
            const token = localStorage.getItem("token");
            await axios.post("http://127.0.0.1:8000/api/storepatient", {
                ...patientData,
                birth_date: formattedBirthDate // إرسال التاريخ بالتنسيق الجديد
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess("تمت إضافة المريض بنجاح!");
            navigate("/showpatient");
        } catch (err) {
            setError(err.response?.data?.message || "حدث خطأ أثناء إضافة المريض.");
        }
    };
    return (
        <div dir={"rtl"} className="flex min-h-screen bg-gray-100">
            {/* الشريط الجانبي */}
            <aside className="w-1/4 bg-cyan-700 text-white p-6">
                {/* ... */}
            </aside>

            {/* المحتوى الرئيسي */}
            <main className="flex-1 p-6">
                {/* ... */}
                <section>
                    <h3 className="text-lg font-bold text-cyan-700 mb-6">إضافة مريض جديد</h3>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={patientData.name}
                                onChange={handleChange}
                                placeholder="اسم المريض"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="identity_number"
                                value={patientData.identity_number}
                                onChange={handleChange}
                                placeholder="رقم الهوية"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                        <div>
                            <input
                                type="date"
                                name="birth_date"
                                value={patientData.birth_date}
                                onChange={handleChange}
                                placeholder="تاريخ الميلاد"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={patientData.phoneNumber}
                                onChange={handleChange}
                                placeholder="رقم الجوال"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                        {/* إضافة حقل العنوان */}
                        <div>
                            <input
                                type="text"
                                name="address"
                                value={patientData.address}
                                onChange={handleChange}
                                placeholder="العنوان"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus                                :ring-cyan-500"
                            />
                        </div>
                        {/* إضافة حقل نوع الرعاية */}
                        <div>
                            <input
                                type="text"
                                name="care_type"
                                value={patientData.care_type}
                                onChange={handleChange}
                                placeholder="نوع الرعاية"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                        {/* إضافة حقل الجنس */}
                        <div>
                            <select
                                name="gender"
                                value={patientData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value="">اختر الجنس</option>
                                <option value="male">ذكر</option>
                                <option value="female">أنثى</option>
                            </select>
                        </div>
                        {/* إضافة حقل كلمة المرور */}
                        <div>
                            <input
                                type="password"
                                name="password"
                                value={patientData.password}
                                onChange={handleChange}
                                placeholder="كلمة المرور"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
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

export default AddPatient;