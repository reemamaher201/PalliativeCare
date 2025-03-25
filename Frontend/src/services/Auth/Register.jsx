import React, { useEffect, useState } from "react";
import Navbar from "../../components/Landing/Navbar.jsx";
import axios from "axios";

const Register = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [identityNumber, setIdentityNumber] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [careType, setCareType] = useState("");
    const [gender, setGender] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [settings, setSettings] = useState(null);


    // خيارات نوع الرعاية
    const careTypeOptions = [
        { value: "general", label: "رعاية عامة" },
        { value: "specialized", label: "رعاية متخصصة" },
        { value: "emergency", label: "رعاية طارئة" },
    ];
    useEffect(() => {
        async function fetchData() {
            try {
                const [
                    settingsRes,
                ] = await Promise.all([
                    axios.get("http://localhost:8000/api/show"),
                ]);

                setSettings(settingsRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("حدث خطأ أثناء تحميل البيانات.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        document.title = "إنشاء حساب";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        // التحقق من صحة البيانات في الواجهة الأمامية
        if (
            !name ||
            !password ||
            !passwordConfirmation ||
            !identityNumber ||
            !phoneNumber ||
            !address ||
            !birthDate ||
            !careType ||
            !gender
        ) {
            setError("الرجاء ملء جميع الحقول المطلوبة.");
            setLoading(false);
            return;
        }

        if (password.length < 8 || password.length > 12) {
            setError("يجب أن تكون كلمة المرور بين 8 و 12 حرفًا.");
            setLoading(false);
            return;
        }

        if (password !== passwordConfirmation) {
            setError("كلمة المرور وتأكيد كلمة المرور غير متطابقتين.");
            setLoading(false);
            return;
        }

        if (phoneNumber.length < 10) {
            setError("يجب أن يكون رقم الهاتف 10 أرقام على الأقل.");
            setLoading(false);
            return;
        }

        if (identityNumber.length < 9) {
            setError("يجب أن يكون رقم الهوية 9 أرقام على الأقل.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/register",
                {
                    name,
                    phoneNumber,
                    identity_number: identityNumber,
                    password,
                    password_confirmation: passwordConfirmation,
                    address,
                    birth_date: birthDate,
                    care_type: careType,
                    gender,
                }
            );
            setLoading(false);
            setSuccess("تم تسجيل الحساب بنجاح!");
            console.log(response.data);
        } catch (error) {
            setLoading(false);
            console.error("Error during registration:", error);
            if (error.response) {
                const errors = error.response.data.errors;
                if (errors) {
                    let errorMessage = "";
                    for (const key in errors) {
                        errorMessage += errors[key].join("\n") + "\n";
                    }
                    setError(errorMessage.trim());
                } else {
                    if (error.response.data.message === "User already exists") {
                        setError(
                            "هذا المستخدم مسجل مسبقًا. الرجاء استخدام رقم هاتف أو هوية آخر."
                        );
                    } else {
                        setError(
                            error.response.data.message || "حدث خطأ أثناء التسجيل."
                        );
                    }
                }
            } else if (error.request) {
                setError("لا يوجد استجابة من الخادم. يرجى التحقق من اتصالك بالإنترنت.");
            } else {
                setError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
            }
        }
    };

    return (
        <div dir="rtl" className="bg-gray-100 font-sans min-h-screen">
            {/* شريط التنقل */}
            <div className="font-sans">
                <Navbar logo={settings?.logo || ""} background_color={settings?.background_color || "#fff"} />
            </div>

            {/* نموذج إنشاء الحساب */}
            <div className="container mx-auto mt-10">
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-cyan-700 text-center mb-6">
                        إنشاء حساب
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            {/* الاسم الكامل */}
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="الاسم الكامل"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>

                            {/* رقم الهاتف */}
                            <div>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="رقم الهاتف"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>

                            {/* رقم الهوية */}
                            <div>
                                <input
                                    type="text"
                                    name="identityNumber"
                                    placeholder="رقم الهوية"
                                    value={identityNumber}
                                    onChange={(e) => setIdentityNumber(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>



                            {/* العنوان */}
                            <div>
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="العنوان"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>

                            {/* تاريخ الميلاد */}
                            <div>
                                <input
                                    type="date"
                                    name="birthDate"
                                    placeholder="تاريخ الميلاد"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>

                            {/* نوع الرعاية */}
                            <div>
                                <select
                                    name="careType"
                                    value={careType}
                                    onChange={(e) => setCareType(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                >
                                    <option value="">نوع الرعاية</option>
                                    {careTypeOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* الجنس */}
                            <div>
                                <select
                                    name="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                >
                                    <option value="">الجنس</option>
                                    <option value="male">ذكر</option>
                                    <option value="female">أنثى</option>
                                </select>
                            </div>
                            <div></div>
                            {/* كلمة المرور */}
                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="كلمة المرور"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>

                            {/* تأكيد كلمة المرور */}
                            <div>
                                <input
                                    type="password"
                                    name="passwordConfirmation"
                                    placeholder="تأكيد كلمة المرور"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* زر تسجيل الحساب */}
                        <div className="mt-6 text-center">
                            <button
                                type="submit"
                                className="bg-cyan-700 text-white px-6 py-2 rounded-lg hover:bg-cyan-800 transition duration-300"
                                disabled={loading}
                            >
                                {loading ? "جاري التسجيل..." : "تسجيل الحساب"}
                            </button>
                        </div>
                    </form>
                    {error && (
                        <div className="text-center text-red-600 mb-6">
                            {error.split("\n").map((item, index) => (
                                <p key={index}>{item}</p>
                            ))}
                        </div>
                    )}
                    {success && (
                        <div className="text-center text-green-600 mb-6">
                            {success}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;