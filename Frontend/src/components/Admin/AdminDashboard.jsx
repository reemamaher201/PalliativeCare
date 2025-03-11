import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandingPage from '../Landing/LandingPage'; // استيراد مكون LandingPage

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('viewLandingPage'); // القسم النشط
    const [newSection, setNewSection] = useState({ title: '', content: '', image: '' }); // بيانات القسم الجديد
    const [settings, setSettings] = useState({
        logo: "",
        main_heading: "",
        main_text: "",
        footer_text: "",
        background_color: "#ffffff",
        button_color: "#3193a5", // لون الزر الافتراضي
    }); // بيانات الإعدادات

    // دالة لإضافة قسم جديد
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSettings({ ...settings, logo: file });
        }
    };


    const handleAddSection = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', newSection.title);
        formData.append('content', newSection.content);
        if (newSection.image) {
            formData.append('image', newSection.image);
        }

        try {
            const response = await axios.post("http://localhost:8000/api/sections", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert("تمت إضافة القسم بنجاح");
            setNewSection({ title: '', content: '', image: null }); // إعادة تعيين الحقول
        } catch (error) {
            console.error("Error adding section:", error);
        }
    };

// دالة لتحديث حالة الصورة
    const handleImageChange = (e) => {
        setNewSection({ ...newSection, image: e.target.files[0] });
    };

    // دالة لحفظ التعديلات
    const handleSubmitSettings = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('main_heading', settings.main_heading);
        formData.append('main_text', settings.main_text);
        formData.append('footer_text', settings.footer_text);
        formData.append('background_color', settings.background_color);
        formData.append('button_color', settings.button_color);
        if (settings.logo instanceof File) {
            formData.append('logo', settings.logo);
        }

        try {
            const response = await axios.post("http://localhost:8000/api/settings/update", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert("تم حفظ التعديلات بنجاح");
        } catch (error) {
            console.error("Error updating settings:", error);
        }
    };

    // جلب الإعدادات عند تحميل المكون
    useEffect(() => {
        axios.get("http://localhost:8000/api/settings")
            .then((response) => {
                setSettings(response.data);
            })
            .catch((error) => {
                console.error("Error fetching settings:", error);
            });
    }, []);

    // دالة لتحديث بيانات الإعدادات
    const handleSettingsChange = (e) => {
        const { name, value } = e.target;
        setSettings({ ...settings, [name]: value });
    };

    return (
        <div dir="rtl" className="flex min-h-screen bg-gray-100">
            {/* الشريط الجانبي */}
            <aside className="w-1/4 bg-cyan-700 text-white p-6">
                <h2 className="text-xl font-bold mb-6">لوحة التحكم الرئيسية</h2>
                <ul className="space-y-4">
                    <li className={`cursor-pointer hover:underline ${activeSection === 'viewLandingPage' ? 'font-bold' : ''}`} onClick={() => setActiveSection('viewLandingPage')}>عرض صفحة الهبوط</li>
                    <li className={`cursor-pointer hover:underline ${activeSection === 'addSection' ? 'font-bold' : ''}`} onClick={() => setActiveSection('addSection')}>إضافة قسم جديد</li>
                    <li className={`cursor-pointer hover:underline ${activeSection === 'editSections' ? 'font-bold' : ''}`} onClick={() => setActiveSection('editSections')}>تعديل الأقسام</li>
                    <li className={`cursor-pointer hover:underline ${activeSection === 'editSettings' ? 'font-bold' : ''}`} onClick={() => setActiveSection('editSettings')}>تعديل الإعدادات</li>
                </ul>
            </aside>

            {/* المحتوى الرئيسي */}
            <main className="flex-1">
                {/* الرأس */}
                <header className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">لوحة تحكم الادمن</h1>
                    <div className="flex space-x-4 space-x-reverse">
                        <i className="fas fa-bell text-gray-500 text-lg cursor-pointer"></i>
                        <i className="fas fa-envelope text-gray-500 text-lg cursor-pointer"></i>
                    </div>
                </header>

                {/* عرض المحتوى بناءً على القسم النشط */}
                {activeSection === 'addSection' && (
                    <div className="bg-white m-6 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">إضافة قسم جديد</h2>
                        <form onSubmit={handleAddSection}>
                            <div className="mb-4">
                                <label className="block text-gray-700">العنوان:</label>
                                <input
                                    type="text"
                                    value={newSection.title}
                                    onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                                    className="w-full px-4 py-2 border rounded"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700">المحتوى:</label>
                                <textarea
                                    value={newSection.content}
                                    onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700">صورة القسم:</label>
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>

                            <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded">
                                إضافة القسم
                            </button>
                        </form>
                    </div>
                )}

                {activeSection === 'editSettings' && (
                    <div className="bg-white m-6 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">تعديل الإعدادات</h2>
                        <form onSubmit={handleSubmitSettings}>
                            <div className="mb-4">
                                <label className="block text-gray-700">الشعار:</label>
                                <input
                                    type="file"
                                    onChange={handleLogoChange}
                                    className="w-full px-4 py-2 border rounded"
                                />
                                {settings.logo && typeof settings.logo === 'string' && (
                                    <img src={`http://localhost:8000${settings.logo}`} alt="الشعار الحالي" className="w-20 h-20 mt-2" />
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700">العنوان الرئيسي:</label>
                                <input
                                    type="text"
                                    name="main_heading"
                                    value={settings.main_heading}
                                    onChange={handleSettingsChange}
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700">النص الرئيسي:</label>
                                <textarea
                                    name="main_text"
                                    value={settings.main_text}
                                    onChange={handleSettingsChange}
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700">نص التذييل:</label>
                                <input
                                    type="text"
                                    name="footer_text"
                                    value={settings.footer_text}
                                    onChange={handleSettingsChange}
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700">لون الخلفية:</label>
                                <input
                                    type="color"
                                    name="background_color"
                                    value={settings.background_color}
                                    onChange={handleSettingsChange}
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700">لون الزر:</label>
                                <input
                                    type="color"
                                    name="button_color"
                                    value={settings.button_color}
                                    onChange={handleSettingsChange}
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>

                            <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded">
                                حفظ التعديلات
                            </button>
                        </form>
                    </div>
                )}
                {activeSection === 'viewLandingPage' && (
                    <div className="m-6">
                        <LandingPage />
                    </div>
                )}

            </main>
        </div>
    );
};

export default AdminDashboard;