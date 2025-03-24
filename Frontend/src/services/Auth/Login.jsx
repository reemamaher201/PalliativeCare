import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import backgroundImage from '../../assets/bg.png';

const Login = () => {
    const [identityNumber, setIdentityNumber] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!identityNumber || !password) {
            setError("يرجى ملء جميع الحقول.");
            setLoading(false);
            return;
        }

        if (!/^\d+$/.test(identityNumber)) {
            setError("رقم الهوية يجب أن يحتوي على أرقام فقط.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login", {
                identity_number: identityNumber,
                password,
            });

            console.log("Login response:", response.data);

            const token = response.data.data.token;
            if (!token) {
                throw new Error("Token not found in response");
            }

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            if (rememberMe) {
                localStorage.setItem("token", token);
            } else {
                sessionStorage.setItem("token", token);
            }
            localStorage.setItem("rememberMe", rememberMe ? "true" : "");

            // فحص وجود الـ token بعد تسجيل الدخول
            const storedToken = rememberMe ? localStorage.getItem("token") : sessionStorage.getItem("token");
            if (!storedToken) {
                setError("حدث خطأ في تخزين رمز الوصول. يرجى المحاولة مرة أخرى.");
                setLoading(false);
                return;
            }

            // استخراج user_type من الـ token
            const userType = getUserTypeFromToken(token);
            if (userType === null) {
                setError("حدث خطأ في فك تشفير الـ Token.");
                setLoading(false);
                return;
            }

            // توجيه المستخدم بناءً على user_type
            navigate(getUserPath(userType));
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleError = (error) => {
        console.error("Login failed:", error);
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    setError("بيانات الاعتماد غير صحيحة.");
                    break;
                case 403:
                    if (error.response.data.message === "User not found") {
                        setError("المستخدم غير موجود.");
                    } else {
                        setError("غير مصرح لك بالوصول.");
                    }
                    break;
                default:
                    setError(error.response.data.message || "حدث خطأ أثناء تسجيل الدخول.");
            }
        } else if (error.message === "Token not found in response") {
            setError("لم يتم العثور على الـ Token في الاستجابة.");
        } else {
            setError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
        }
    };

    const getUserTypeFromToken = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.user_type; // افترض أن الـ token يحتوي على user_type
        } catch (error) {
            console.error("Failed to decode token:", error);
            return null;
        }
    };

    const getUserPath = (userType) => {
        switch (userType) {
            case 0: return "/dashboardM";
            case 1: return "/dashboardS";
            case 2: return "/user-profile";
            case 3: return "/admin-dashboard";
            default: return "/";
        }
    };

    return (
        <div dir="rtl" className="min-h-screen flex items-center justify-center relative" style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg relative z-10">
                <h2 className="text-2xl font-bold text-center text-cyan-700 mb-6">تسجيل دخول</h2>

                <form onSubmit={handleSubmit}>
                    <InputField
                        type="text"
                        placeholder="رقم الهوية"
                        value={identityNumber}
                        onChange={setIdentityNumber}
                    />
                    <InputField
                        type={showPassword ? "text" : "password"}
                        placeholder="كلمة المرور"
                        value={password}
                        onChange={setPassword}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                    />
                    <div className="mb-6 flex items-center">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="rememberMe" className="text-gray-700">تذكرني</label>
                    </div>

                    <button type="submit" className="w-full bg-cyan-700 text-white py-2 px-4 rounded-lg hover:bg-cyan-800 transition duration-300" disabled={loading}>
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <span>جاري تسجيل الدخول...</span>
                                <i className="fas fa-spinner fa-spin ml-2"></i>
                            </div>
                        ) : (
                            "تسجيل الدخول"
                        )}
                    </button>
                    {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
                </form>

                <div className="text-center mt-4">
                    <a href={"/register"} className="text-cyan-500 hover:underline">أنشئ حساب</a>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ type, placeholder, value, onChange, showPassword, setShowPassword }) => (
    <div className="mb-4">
        <div className="relative">
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
                className="w-full px-8 py-2 pl-10 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                <i className={type === "password" ? "fas fa-lock" : "fas fa-user"}></i>
            </span>
            {type === "password" && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-3 flex items-center text-gray-400"
                >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
            )}
        </div>
    </div>
);

export default Login;