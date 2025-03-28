import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/bg.png'; // تأكد من تعديل المسار للصورة
import { FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
    const [identityNumber, setIdentityNumber] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login", {
                identity_number: identityNumber,
                password,
            });

            const token = response.data.data.token;
            localStorage.setItem("token", token);

            const userType = response.data.data.user.user_type;
            navigate(getUserPath(userType));

        } catch (err) {
            console.error("Login failed:", err);
            if (err.response) {
                setError(err.response.data.error || "بيانات الاعتماد غير صحيحة");
            } else {
                setError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getUserPath = (userType) => {
        switch (userType) {
            case 0: return "/dashboardM"; // مزود
            case 1: return "/dashboardS"; // وزارة
            case 2: return "/user-profile"; // مريض
            case 3: return "/admin-dashboard"; // إداري
            default: return "/";
        }
    };

    return (
        <div
            dir="rtl"
            className="min-h-screen flex items-center justify-center relative"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg relative z-10">
                <h2 className="text-2xl font-bold text-center text-cyan-700 mb-6">تسجيل دخول</h2>

                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    {/* رقم الهوية */}
                    <div className="mb-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="رقم الهوية"
                                value={identityNumber}
                                onChange={(e) => setIdentityNumber(e.target.value)}
                                className="w-full px-8 py-2 pl-10 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                            />
                            <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                                <FaUser />
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
                                className="w-full px-8 py-2 pl-10 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                            />
                            <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                                <FaLock />
                            </span>
                        </div>
                    </div>

                    {/* زر تسجيل الدخول */}
                    <button
                        type="submit"
                        className={`w-full bg-cyan-700 text-white py-2 px-4 rounded-lg hover:bg-cyan-800 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                    </button>
                </form>

                {/* خيارات إضافية */}
                <div className="text-center mt-4">
                    <a href="/register" className="text-cyan-500 hover:underline">
                        أنشئ حساب
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;