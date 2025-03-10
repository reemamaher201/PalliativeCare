import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [landingPage, setLandingPage] = useState({
        title: '',
        description: '',
        image: null,
        sections: [],
        colors: { primary: '#06b6d4', secondary: '#ffffff' },
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeSection, setActiveSection] = useState('addSection'); // إضافة الحالة للقسم النشط
    const [newSection, setNewSection] = useState({ title: '', content: '' }); // الحالة للقسم الجديد
    useEffect(() => {
        fetchLandingPage();
    }, []);

    const fetchLandingPage = async () => {
        try {
            const response = await axios.get('/api/admin/landing-page');
            setLandingPage(response.data);
        } catch (error) {
            setError('فشل في جلب بيانات صفحة الهبوط');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('title', landingPage.title);
        formData.append('description', landingPage.description);
        formData.append('sections', JSON.stringify(landingPage.sections));
        formData.append('colors', JSON.stringify(landingPage.colors));
        if (landingPage.image) {
            formData.append('image', landingPage.image);
        }

        try {
            await axios.post('/api/admin/landing-page', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('تم تحديث صفحة الهبوط بنجاح');
        } catch (error) {
            console.error('فشل في تحديث صفحة الهبوط:', error.response?.data || error.message);
            setError('فشل في تحديث صفحة الهبوط');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLandingPage({ ...landingPage, [name]: value });
    };

    const handleImageChange = (e) => {
        setLandingPage({ ...landingPage, image: e.target.files[0] });
    };

    const handleSectionChange = (index, field, value) => {
        const updatedSections = [...landingPage.sections];
        updatedSections[index][field] = value;
        setLandingPage({ ...landingPage, sections: updatedSections });
    };

    const addSection = () => {
        setLandingPage({
            ...landingPage,
            sections: [...landingPage.sections, { title: '', content: '' }],
        });
    };

    const handleColorChange = (e) => {
        const { name, value } = e.target;
        setLandingPage({
            ...landingPage,
            colors: { ...landingPage.colors, [name]: value },
        });
    };

    return (
        <div dir="rtl" className="flex min-h-screen bg-gray-100">
            {/* الشريط الجانبي */}
            <aside className="w-1/4 bg-cyan-700 text-white p-6">
                <h2 className="text-xl font-bold mb-6">لوحة التحكم الرئيسية</h2>
                <ul className="space-y-4">
                    <li
                        className={`hover:underline cursor-pointer ${activeSection === 'addSection' ? 'font-bold' : ''}`}
                        onClick={() => setActiveSection('addSection')}
                    >
                        إضافة قسم جديد
                    </li>
                    <li
                        className={`hover:underline cursor-pointer ${activeSection === 'editSections' ? 'font-bold' : ''}`}
                        onClick={() => setActiveSection('editSections')}
                    >
                        تعديل الأقسام
                    </li>
                    <li
                        className={`hover:underline cursor-pointer ${activeSection === 'editColors' ? 'font-bold' : ''}`}
                        onClick={() => setActiveSection('editColors')}
                    >
                        تعديل الألوان
                    </li>
                </ul>
            </aside>

            {/* المحتوى الرئيسي */}
            <main className="flex-1 p-6">
                {/* الرأس */}
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">لوحة تحكم الادمن</h1>
                    <div className="flex space-x-4 space-x-reverse">
                        <i className="fas fa-bell text-gray-500 text-lg cursor-pointer"></i>
                        <i className="fas fa-envelope text-gray-500 text-lg cursor-pointer"></i>
                    </div>
                </header>

                {/* عرض المحتوى بناءً على القسم النشط */}
                {activeSection === 'addSection' && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-bold mb-4">إضافة قسم جديد</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="عنوان القسم"
                                value={newSection.title}
                                onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                            <textarea
                                placeholder="محتوى القسم"
                                value={newSection.content}
                                onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                            <button
                                onClick={handleAddSection}
                                className="bg-cyan-500 text-white px-4 py-2 rounded-lg"
                            >
                                إضافة قسم
                            </button>
                        </div>
                    </div>
                )}

                {activeSection === 'editSections' && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-bold mb-4">تعديل الأقسام</h2>
                        <div className="space-y-4">
                            {landingPage.sections.map((section, index) => (
                                <div key={index} className="border p-4 rounded-lg">
                                    <h3 className="font-bold">{section.title}</h3>
                                    <p>{section.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'editColors' && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-bold mb-4">تعديل الألوان</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700">اللون الأساسي</label>
                                <input
                                    type="color"
                                    name="primary"
                                    value={landingPage.colors.primary}
                                    onChange={handleColorChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">اللون الثانوي</label>
                                <input
                                    type="color"
                                    name="secondary"
                                    value={landingPage.colors.secondary}
                                    onChange={handleColorChange}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* زر حفظ التغييرات */}
                <div className="mt-6">
                    <button
                        onClick={handleSaveChanges}
                        className="bg-cyan-500 text-white px-4 py-2 rounded-lg"
                    >
                        حفظ التغييرات
                    </button>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;