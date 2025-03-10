import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Landing/Navbar.jsx";
import backgroundImage from '../../assets/bg.png'; // تأكد من تعديل المسار للصورة

const Login = () => {
    const [identityNumber, setIdentityNumber] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        document.title = "تسجيل الدخول";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login", {
                identity_number: identityNumber,
                password,
            });

            console.log("Login successful:", response.data);

            // تخزين التوكن في التخزين المحلي
            localStorage.setItem("token", response.data.token);

            // التحقق من نوع المستخدم وتوجيهه إلى الصفحة المناسبة
            const userType = response.data.user_type;
            if (userType === 0) {
                window.location.href = "/dashboardM";
            } else if (userType === 1) {
                window.location.href = "/dashboardS";
            } else if (userType === 2) {
                window.location.href = "/user-profile";
            } else if (userType === 3) { // أضف هذا الشرط للادمن
                window.location.href = "/admin-dashboard";
            } else {
                setError("نوع المستخدم غير معروف.");
            }
        } catch (error) {
            console.error("Login failed:", error);
            if (error.response) {
                setError(error.response.data.message || "فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.");
            } else {
                setError("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.");
            }
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            {/* العنصر الأول: Navbar */}
            {/*<div className="font-sans">*/}
            {/*    <Navbar />*/}
            {/*</div>*/}

            {/* العنصر الثاني: صفحة تسجيل الدخول */}
            <div
                dir="rtl"
                className="min-h-screen flex items-center justify-center relative"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* طبقة شفافة */}
                <div className="absolute inset-0 bg-black opacity-50"></div> {/* طبقة شفافة سوداء */}

                {/* صندوق تسجيل الدخول */}
                <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg relative z-10">
                    <h2 className="text-2xl font-bold text-center text-cyan-700 mb-6">تسجيل دخول</h2>

                    {/* الحقول */}
                    <form onSubmit={handleSubmit}>
                        {/* البريد الإلكتروني / اسم المستخدم */}
                        <div className="mb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="رقم الهوية"
                                    value={identityNumber}
                                    onChange={(e) => setIdentityNumber(e.target.value)}
                                    required
                                    className="w-full px-8 py-2 pl-10 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                                    <i className="fas fa-user"></i>
                                </span>
                            </div>
                        </div>

                        {/* كلمة المرور */}
                        <div className="mb-6">

                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="كلمة المرور"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-8 py-2 pl-10 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                                    <i className="fas fa-lock"></i>
                                </span>
                            </div>
                        </div>

                        {/* زر تسجيل الدخول */}

                        <button type="submit"  className="w-full bg-cyan-700 text-white py-2 px-4 rounded-lg hover:bg-cyan-800 transition duration-300" disabled={loading}>
                            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                        </button>
                        {error && <p>{error}</p>}
                    </form>

                    {/* خيارات إضافية */}
                    <div className="text-center mt-4">
                        <a href="/register" className="text-cyan-500 hover:underline">
                            أنشئ حساب
                        </a>
                    </div>

                    {/*/!* تسجيل الدخول عبر وسائل أخرى *!/*/}
                    {/*<div className="flex items-center justify-center mt-6 space-x-4">*/}
                    {/*    <button className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200">*/}
                    {/*        <i className="fab fa-google text-cyan-700"></i>*/}
                    {/*    </button>*/}
                    {/*    <button className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200">*/}
                    {/*        <i className="fas fa-envelope text-cyan-700"></i>*/}
                    {/*    </button>*/}
                    {/*</div>*/}
                </div>
            </div>
        </>
    );
};

export default Login;