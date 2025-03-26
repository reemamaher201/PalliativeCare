import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Navbar from "./pNavbar.jsx";
import errorGif from '../../assets/Mobile Login.gif';
import ChatButton from "../Utilties/ChatButton.jsx";
import { PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");

            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError(
                        <div className="flex flex-col items-center justify-center">
                            <img src={errorGif} alt="Error" className="h-100 w-100 mb-8" />
                            <p className="text-red-600 font-semibold mb-4">لم يتم العثور على المستخدم. يرجى تسجيل الدخول.</p>
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-cyan-700 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded"
                            >
                                تسجيل الدخول
                            </button>
                        </div>
                    );
                    setLoading(false);
                    return;
                }

                // Fetch user data
                const userResponse = await axios.get("http://127.0.0.1:8000/api/user-profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserData(userResponse.data);
                setFormData({
                    name: userResponse.data.name,
                    address: userResponse.data.address,
                    care_type: userResponse.data.care_type,
                    gender: userResponse.data.gender,
                    identity_number: userResponse.data.identity_number,
                    age: userResponse.data.age
                });

                // Fetch medicines
                const medicinesResponse = await axios.get("http://127.0.0.1:8000/api/showmedicines", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMedicines(medicinesResponse.data.medicines || []); // تعديل هنا

            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.response?.data?.message || "حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("لم يتم العثور على المستخدم. يرجى تسجيل الدخول.");
                return;
            }

            await axios.post("http://127.0.0.1:8000/api/logout", null, {
                headers: { Authorization: `Bearer ${token}` }
            });

            localStorage.removeItem("token");
            navigate("/");
        } catch (err) {
            console.error("Error logging out:", err);
            setError(err.response?.data?.message || "حدث خطأ أثناء تسجيل الخروج. يرجى المحاولة مرة أخرى.");
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                "http://127.0.0.1:8000/api/update-profile",
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUserData(response.data.user);
            setIsEditing(false);
            alert("تم تحديث البيانات بنجاح");
        } catch (err) {
            console.error("Error updating profile:", err);
            alert(err.response?.data?.message || "فشل في تحديث البيانات");
        }
    };

    const handleCancelEdit = () => {
        setFormData({
            name: userData.name,
            address: userData.address,
            care_type: userData.care_type,
            gender: userData.gender,
            identity_number: userData.identity_number,
            age: userData.age
        });
        setIsEditing(false);
    };

    const handleMedicineRequest = (medicineId) => {
        navigate(`/request-medicine/${medicineId}`);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                <p className="mt-4 text-lg font-semibold text-cyan-500">جاري تحميل البيانات...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-center mt-8 text-red-600">{error}</div>;
    }

    if (!userData) {
        return <div className="text-center mt-8">لا توجد بيانات للمستخدم.</div>;
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="font-sans">
                <Navbar onLogout={handleLogout} />
            </div>

            <div className="container mx-auto p-4">
                {/* Header with Edit Button */}
                <div className="flex justify-between items-center mb-6">
                    {isEditing ? (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                            >
                                <CheckIcon className="h-5 w-5" />
                                حفظ التغييرات
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                            >
                                <XMarkIcon className="h-5 w-5" />
                                إلغاء
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleEditToggle}
                            className="flex items-center gap-2 bg-cyan-700 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
                        >
                            <PencilSquareIcon className="h-5 w-5" />
                            تعديل البيانات
                        </button>
                    )}
                    <h1 className="text-2xl font-bold text-cyan-700">الملف الشخصي</h1>

                </div>

                {/* Profile Sections */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    {/* Personal Info */}
                    <div className="w-full md:w-1/2 bg-gray-50 p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 text-cyan-700 border-b pb-2">المعلومات الشخصية</h2>
                        <InfoRow
                            label="الاسم الكامل"
                            name="name"
                            value={isEditing ? formData.name : userData.name}
                            isEditing={isEditing}
                            onChange={handleInputChange}
                        />
                        <InfoRow
                            label="رقم الهوية"
                            value={userData.identity_number || "غير متوفر"}
                        />
                        <InfoRow
                            label="العمر"
                            value={userData.age ? `${userData.age} سنة` : "غير متوفر"}
                        />
                        <InfoRow
                            label="الجنس"
                            value={userData.gender ? userData.gender : "غير متوفر"}
                        />
                    </div>

                    {/* Contact Info */}
                    <div className="w-full md:w-1/2 bg-gray-50 p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 text-cyan-700 border-b pb-2">معلومات الاتصال</h2>
                        <InfoRow
                            label="عنوان السكن"
                            name="address"
                            value={isEditing ? formData.address : userData.address}
                            isEditing={isEditing}
                            onChange={handleInputChange}
                        />
                        <InfoRow
                            label="نوع الرعاية"
                            name="care_type"
                            value={isEditing ? formData.care_type : userData.care_type}
                            isEditing={isEditing}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Available Medicines */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-cyan-700 border-b pb-2">الأدوية المتاحة</h2>
                    {medicines.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {medicines.map(medicine => (
                                <div key={medicine.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                    <h3 className="text-lg font-bold text-gray-800">{medicine.name}</h3>

                                    <div className="mt-2 text-sm text-gray-600 space-y-2">
                                        <p><span className="font-medium">الوصف:</span> {medicine.description || 'غير متوفر'}</p>
                                        <p><span className="font-medium">الكمية المتوفرة:</span> {medicine.distributed_quantity}</p>
                                        <p><span className="font-medium">المواقع:</span> {medicine.locations || 'غير محدد'}</p>
                                        <p><span className="font-medium">تاريخ التوزيع القادم:</span> {medicine.next_distribution_date || 'غير محدد'}</p>
                                        <p><span className="font-medium">النوع:</span> {medicine.type || 'غير محدد'}</p>
                                        <p><span className="font-medium">أضيف بواسطة:</span> {medicine.added_by?.name || 'غير معروف'}</p>
                                    </div>

                                    <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {new Date(medicine.created_at).toLocaleDateString()}
          </span>
                                        <button
                                            onClick={() => handleMedicineRequest(medicine.id)}
                                            className="bg-cyan-700 hover:bg-cyan-600 text-white py-1 px-3 rounded text-sm"
                                        >
                                            طلب الدواء
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">لا توجد أدوية متاحة حالياً</h3>
                        </div>
                    )}
                </div>
            </div>

            <ChatButton />
        </div>
    );
};

const InfoRow = ({ label, name, value, isEditing = false, onChange }) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-right mb-2">{label}</label>
            {isEditing ? (
                <input
                    type="text"
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                />
            ) : (
                <input
                    type="text"
                    value={value || "غير متوفر"}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none bg-gray-100 text-gray-700"
                    readOnly
                />
            )}
        </div>
    );
};

export default UserProfile;