import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/bg.png';

const Login = () => {
    const [identityNumber, setIdentityNumber] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

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

            localStorage.setItem("token", response.data.token);

            // فك تشفير التوكن للحصول على user_type
            const decodedToken = JSON.parse(atob(response.data.token.split('.')[1]));
            const userType = decodedToken.user_type;

            // التحقق من وجود user_type
            if (userType === undefined) {
                setError("لم يتم العثور على نوع المستخدم في التوكن.");
                setLoading(false);
                return;
            }

            // توجيه المستخدم بناءً على user_type
            switch (userType) {
                case 0:
                    navigate("/dashboardM");
                    break;
                case 1:
                    navigate("/dashboardS");
                    break;
                case 2:
                    navigate("/user-profile");
                    break;
                case 3:
                    navigate("/admin-dashboard");
                    break;
                default:
                    setError("نوع المستخدم غير معروف.");
                    break;
            }
        } catch (error) {
            console.error("Login failed:", error);
            if (error.response) {
                // التعامل مع أخطاء الـ API
                if (error.response.status === 401) {
                    setError("بيانات الاعتماد غير صحيحة.");
                } else if (error.response.status === 403) {
                    setError("غير مصرح لك بالوصول.");
                } else {
                    setError(error.response.data.message || "فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.");
                }
            } else if (error.request) {
                setError("لا يمكن الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.");
            } else {
                setError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
            }
        } finally {
            setLoading(false);
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

                <form onSubmit={handleSubmit}>
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

                    <button type="submit" className="w-full bg-cyan-700 text-white py-2 px-4 rounded-lg hover:bg-cyan-800 transition duration-300" disabled={loading}>
                        {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>

                <div className="text-center mt-4">
                    <a href={"/register"} className="text-cyan-500 hover:underline">
                        أنشئ حساب
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;