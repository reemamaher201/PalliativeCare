import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandingPage from '../Landing/LandingPage';
import {
    FaInfo, FaCheck, FaEye, FaPlus, FaCog, FaTools, FaListAlt,
    FaBlog, FaBook, FaLink, FaPhone, FaTimes, FaUser, FaStar,
    FaHeart, FaBell, FaComment, FaMusic, FaLock, FaPaperPlane,
    FaClipboard, FaTasks, FaGlobe, FaClipboardList, FaChartBar,
    FaHeartBroken, FaLightbulb, FaPaperclip, FaUserPlus, FaUserTimes, FaEdit
} from "react-icons/fa";
import EditLandingPage from "./EditLandingPage.jsx";
import {logout} from "../../services/Auth/auth.jsx";

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('viewLandingPage');

    // States for all sections with bilingual support
    const [newSection, setNewSection] = useState({
        title_ar: '', title_en: '',
        content_ar: '', content_en: '',
        image: ''
    });

    const [newService, setNewService] = useState({
        title_ar: '', title_en: '',
        description_ar: '', description_en: '',
        image: ''
    });

    const [newBlog, setNewBlog] = useState({
        title_ar: '', title_en: '',
        content_ar: '', content_en: '',
        link: ''
    });

    const [settings, setSettings] = useState({
        logo: "",
        imgabout: "",
        main_heading_ar: "مرحباً بكم",
        main_heading_en: "Welcome",
        main_text_ar: "نحن هنا لخدمتك",
        main_text_en: "We are here to serve you",
        footer_text_ar: "جميع الحقوق محفوظة",
        footer_text_en: "All rights reserved",
        background_color: "#ffffff",
        button_color: "#3193a5",
    });

    const [newFeature, setNewFeature] = useState({
        title_ar: '', title_en: '',
        description_ar: '', description_en: '',
        icon: '',
        image: null
    });

    const [newSocial, setNewSocial] = useState({ social: '' });
    const [newLink, setNewLink] = useState({
        title_ar: '', title_en: '',
        link: ''
    });

    // Available icons for features
    const availableIcons = [
        {icon: <FaInfo/>,name: 'info-circle'},
        { icon: <FaCheck />, name: 'Check' },
        { icon: <FaEye />, name: 'Eye' },
        { icon: <FaPlus />, name: 'Plus' },
        { icon: <FaCog />, name: 'Settings' },
        { icon: <FaTools />, name: 'Tools' },
        { icon: <FaListAlt />, name: 'List' },
        { icon: <FaBlog />, name: 'Blog' },
        { icon: <FaBook />, name: 'Book' },
        { icon: <FaLink />, name: 'Link' },
        { icon: <FaPhone />, name: 'Phone' },
        { icon: <FaTimes />, name: 'Close' },
        { icon: <FaUser />, name: 'User' },
        { icon: <FaStar />, name: 'Star' },
        { icon: <FaHeart />, name: 'Heart' },
        { icon: <FaBell />, name: 'Bell' },
        { icon: <FaComment />, name: 'Comment' },
        { icon: <FaMusic />, name: 'Music' },
        { icon: <FaLock />, name: 'Lock' },
        { icon: <FaPaperPlane />, name: 'Paper Plane' },
        { icon: <FaClipboard />, name: 'Clipboard' },
        { icon: <FaTasks />, name: 'Tasks' },
        { icon: <FaGlobe />, name: 'Globe' },
        { icon: <FaClipboardList />, name: 'Clipboard List' },
        { icon: <FaChartBar />, name: 'Chart' },
        { icon: <FaHeartBroken />, name: 'Broken Heart' },
        { icon: <FaLightbulb />, name: 'Light Bulb' },
        { icon: <FaPaperclip />, name: 'Paperclip' },
        { icon: <FaUserPlus />, name: 'User Plus' },
        { icon: <FaUserTimes />, name: 'User Times' }
    ];

    // Image handlers
    const handleLogoChange = (e) => {
        setSettings({ ...settings, logo: e.target.files[0] });
    };

    const handleImageAboutChange = (e) => {
        setSettings({ ...settings, imgabout: e.target.files[0] });
    };

    const handleImageChange = (e) => {
        setNewSection({ ...newSection, image: e.target.files[0] });
    };

    const handleImageService = (e) => {
        setNewService({ ...newService, image: e.target.files[0] });
    };

    const handleImageFeature = (e) => {
        setNewFeature({ ...newFeature, image: e.target.files[0] });
    };

    // Form submission handlers with bilingual support
    const handleAddSection = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Arabic content
        formData.append('title_ar', newSection.title_ar);
        formData.append('content_ar', newSection.content_ar);

        // English content
        formData.append('title_en', newSection.title_en);
        formData.append('content_en', newSection.content_en);

        if (newSection.image) {
            formData.append('image', newSection.image);
        }

        try {
            await axios.post("http://localhost:8000/api/sections", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            alert("تمت إضافة القسم بنجاح / Section added successfully");
            setNewSection({
                title_ar: '', title_en: '',
                content_ar: '', content_en: '',
                image: null
            });
        } catch (error) {
            console.error("Error adding section:", error);
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('title_ar', newService.title_ar);
        formData.append('title_en', newService.title_en);
        formData.append('description_ar', newService.description_ar);
        formData.append('description_en', newService.description_en);

        if (newService.image) {
            formData.append('image', newService.image);
        }

        try {
            await axios.post("http://localhost:8000/api/services", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            alert("تمت إضافة الخدمة بنجاح / Service added successfully");
            setNewService({
                title_ar: '', title_en: '',
                description_ar: '', description_en: '',
                image: null
            });
        } catch (error) {
            console.error("Error adding service:", error);
        }
    };

    const handleAddBlog = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('title_ar', newBlog.title_ar);
        formData.append('title_en', newBlog.title_en);
        formData.append('content_ar', newBlog.content_ar);
        formData.append('content_en', newBlog.content_en);
        formData.append('link', newBlog.link);

        try {
            await axios.post("http://localhost:8000/api/blogs", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            alert("تمت إضافة المدونة بنجاح / Blog added successfully");
            setNewBlog({
                title_ar: '', title_en: '',
                content_ar: '', content_en: '',
                link: ''
            });
        } catch (error) {
            console.error("Error adding blog:", error);
        }
    };

    const handleAddFeature = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('title_ar', newFeature.title_ar);
        formData.append('title_en', newFeature.title_en);
        formData.append('description_ar', newFeature.description_ar);
        formData.append('description_en', newFeature.description_en);
        formData.append('icon', newFeature.icon);

        if (newFeature.image) {
            formData.append('image', newFeature.image);
        }

        try {
            await axios.post("http://localhost:8000/api/features", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            alert("تمت إضافة الميزة بنجاح / Feature added successfully");
            setNewFeature({
                title_ar: '', title_en: '',
                description_ar: '', description_en: '',
                icon: '',
                image: null
            });
        } catch (error) {
            console.error("Error adding feature:", error);
        }
    };

    const handleAddSocial = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8000/api/social", newSocial, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            alert("تمت إضافة رقم التواصل بنجاح / Contact added successfully");
            setNewSocial({ social: '' });
        } catch (error) {
            console.error("Error adding social:", error);
        }
    };

    const handleAddLink = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('title_ar', newLink.title_ar);
        formData.append('title_en', newLink.title_en);
        formData.append('link', newLink.link);

        try {
            await axios.post("http://localhost:8000/api/fastlink", formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            alert("تمت إضافة الرابط بنجاح / Link added successfully");
            setNewLink({
                title_ar: '', title_en: '',
                link: ''
            });
        } catch (error) {
            console.error("Error adding link:", error);
        }
    };

    const handleSubmitSettings = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Arabic content
        formData.append('main_heading_ar', settings.main_heading_ar);
        formData.append('main_text_ar', settings.main_text_ar);
        formData.append('footer_text_ar', settings.footer_text_ar);

        // English content
        formData.append('main_heading_en', settings.main_heading_en);
        formData.append('main_text_en', settings.main_text_en);
        formData.append('footer_text_en', settings.footer_text_en);

        formData.append('background_color', settings.background_color);
        formData.append('button_color', settings.button_color);

        if (settings.logo instanceof File) {
            formData.append('logo', settings.logo);
        }
        if (settings.imgabout instanceof File) {
            formData.append('imgabout', settings.imgabout);
        }

        try {
            await axios.post("http://localhost:8000/api/settings/update", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            alert("تم حفظ التعديلات بنجاح / Settings saved successfully");
        } catch (error) {
            console.error("Error updating settings:", error);
        }
    };

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    settingsRes,
                    sectionsRes,
                    servicesRes,
                    blogsRes,
                    featuresRes,
                    socialRes,
                    linksRes
                ] = await Promise.all([
                    axios.get("http://localhost:8000/api/show"),
                    axios.get("http://localhost:8000/api/sections"),
                    axios.get("http://localhost:8000/api/services"),
                    axios.get("http://localhost:8000/api/blogs"),
                    axios.get("http://localhost:8000/api/features"),
                    axios.get("http://localhost:8000/api/social"),
                    axios.get("http://localhost:8000/api/fastlink")
                ]);

                // Update states with fetched data
                setSettings(settingsRes.data);
                // Update other states similarly...

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleSettingsChange = (e) => {
        const { name, value } = e.target;
        setSettings({ ...settings, [name]: value });
    };

    return (
        <div dir="rtl" className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-1/4 bg-cyan-700 text-white p-6 flex flex-col">
                <h2 className="text-xl font-bold mb-6">لوحة التحكم الرئيسية</h2>
                <ul className="space-y-6 text-right">
                    <li className={`cursor-pointer flex items-center justify-center hover:underline mb-6 ${activeSection === 'viewLandingPage' ? 'font-bold' : ''}`}
                        onClick={() => setActiveSection('viewLandingPage')}>
                        <FaEye className="ml-2" />
                        عرض صفحة الهبوط
                    </li>
                    <li className={`cursor-pointer flex items-center justify-center hover:underline mb-6 ${activeSection === 'addSection' ? 'font-bold' : ''}`}
                        onClick={() => setActiveSection('addSection')}>
                        <FaPlus className="ml-2" />
                        قسم جديد
                    </li>
                    <li className={`cursor-pointer flex items-center justify-center hover:underline mb-6 ${activeSection === 'editSettings' ? 'font-bold' : ''}`}
                        onClick={() => setActiveSection('editSettings')}>
                        <FaCog className="ml-2" />
                        الإعدادات
                    </li>
                    <li className={`cursor-pointer flex items-center justify-center hover:underline mb-6 ${activeSection === 'addServices' ? 'font-bold' : ''}`}
                        onClick={() => setActiveSection('addServices')}>
                        <FaTools className="ml-2" />
                        الخدمات
                    </li>
                    <li className={`cursor-pointer flex items-center justify-center hover:underline mb-6 ${activeSection === 'features' ? 'font-bold' : ''}`}
                        onClick={() => setActiveSection('features')}>
                        <FaListAlt className="ml-2" />
                        مزايا التسجيل
                    </li>
                    <li className={`cursor-pointer flex items-center justify-center hover:underline mb-6 ${activeSection === 'blog' ? 'font-bold' : ''}`}
                        onClick={() => setActiveSection('blog')}>
                        <FaBook className="ml-2" />
                        النصائح و المدونات
                    </li>
                    <li className={`cursor-pointer flex items-center justify-center hover:underline mb-6 ${activeSection === 'fastLink' ? 'font-bold' : ''}`}
                        onClick={() => setActiveSection('fastLink')}>
                        <FaLink className="ml-2" />
                        الروابط السريعة
                    </li>
                    <li className={`cursor-pointer flex items-center justify-center hover:underline mb-6 ${activeSection === 'social' ? 'font-bold' : ''}`}
                        onClick={() => setActiveSection('social')}>
                        <FaPhone className="ml-2" />
                        معلومات التواصل
                    </li>
                    <li className={`cursor-pointer flex items-center justify-center hover:underline mb-6 ${activeSection === 'editPage' ? 'font-bold' : ''}`}
                        onClick={() => setActiveSection('editPage')}>
                        <FaEdit className="ml-2" />
                        تعديل صفحة الهبوط
                    </li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
                    <h1 className="text-xl font-bold">أدمن</h1>
                    <button onClick={logout} className="text-cyan-500 hover:text-cyan-700">
                        <i className="fas fa-sign-out-alt text-xl"></i>
                    </button>
                </header>

                <div className="flex-1 p-6 overflow-auto">
                    {activeSection === 'addServices' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">إضافة خدمة جديدة</h2>
                            <form onSubmit={handleAddService}>
                                <div className="mb-4 border-b pb-4">
                                    <h3 className="font-medium text-gray-700 mb-2">المحتوى العربي</h3>
                                    <input
                                        type="text"
                                        placeholder="عنوان الخدمة (عربي)"
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        value={newService.title_ar}
                                        onChange={(e) => setNewService({ ...newService, title_ar: e.target.value })}
                                        required
                                    />
                                    <textarea
                                        placeholder="وصف الخدمة (عربي)"
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        value={newService.description_ar}
                                        onChange={(e) => setNewService({ ...newService, description_ar: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-medium text-gray-700 mb-2">English Content</h3>
                                    <input
                                        type="text"
                                        placeholder="Service Title (English)"
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        value={newService.title_en}
                                        onChange={(e) => setNewService({ ...newService, title_en: e.target.value })}
                                        required
                                    />
                                    <textarea
                                        placeholder="Service Description (English)"
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        value={newService.description_en}
                                        onChange={(e) => setNewService({ ...newService, description_en: e.target.value })}
                                        required
                                    />
                                </div>

                                <input type="file" onChange={handleImageService} className="w-full px-4 py-2 border rounded mb-4" />
                                <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded">إضافة / Add</button>
                            </form>
                        </div>
                    )}

                    {activeSection === 'editPage' && (
                        <div className="m-6">
                            <EditLandingPage />
                        </div>
                    )}

                    {activeSection === 'social' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">إضافة رقم تواصل</h2>
                            <form onSubmit={handleAddSocial}>
                                <input
                                    type="text"
                                    placeholder="رقم التواصل"
                                    className="w-full px-4 py-2 border rounded mb-4"
                                    value={newSocial.social}
                                    onChange={(e) => setNewSocial({ social: e.target.value })}
                                    required
                                />
                                <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded">إضافة / Add</button>
                            </form>
                        </div>
                    )}

                    {activeSection === 'fastLink' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">إضافة روابط سريعة</h2>
                            <form onSubmit={handleAddLink}>
                                <div className="mb-4 border-b pb-4">
                                    <h3 className="font-medium text-gray-700 mb-2">المحتوى العربي</h3>
                                    <input
                                        type="text"
                                        placeholder="العنوان (عربي)"
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        value={newLink.title_ar}
                                        onChange={(e) => setNewLink({ ...newLink, title_ar: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-medium text-gray-700 mb-2">English Content</h3>
                                    <input
                                        type="text"
                                        placeholder="Title (English)"
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        value={newLink.title_en}
                                        onChange={(e) => setNewLink({ ...newLink, title_en: e.target.value })}
                                        required
                                    />
                                </div>

                                <input
                                    type="text"
                                    placeholder="الرابط / Link"
                                    className="w-full px-4 py-2 border rounded mb-4"
                                    value={newLink.link}
                                    onChange={(e) => setNewLink({ ...newLink, link: e.target.value })}
                                    required
                                />
                                <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded">إضافة / Add</button>
                            </form>
                        </div>
                    )}

                    {activeSection === 'features' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">إضافة ميزة جديدة</h2>
                            <form onSubmit={handleAddFeature}>
                                <div className="mb-4 border-b pb-4">
                                    <h3 className="font-medium text-gray-700 mb-2">المحتوى العربي</h3>
                                    <input
                                        type="text"
                                        placeholder="العنوان (عربي)"
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        value={newFeature.title_ar}
                                        onChange={(e) => setNewFeature({ ...newFeature, title_ar: e.target.value })}
                                        required
                                    />
                                    <textarea
                                        placeholder="الوصف (عربي)"
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        value={newFeature.description_ar}
                                        onChange={(e) => setNewFeature({ ...newFeature, description_ar: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-medium text-gray-700 mb-2">English Content</h3>
                                    <input
                                        type="text"
                                        placeholder="Title (English)"
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        value={newFeature.title_en}
                                        onChange={(e) => setNewFeature({ ...newFeature, title_en: e.target.value })}
                                        required
                                    />
                                    <textarea
                                        placeholder="Description (English)"
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        value={newFeature.description_en}
                                        onChange={(e) => setNewFeature({ ...newFeature, description_en: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block mb-2">اختر أيقونة / Choose Icon:</label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableIcons.map((item, index) => (
                                            <div
                                                key={index}
                                                onClick={() => setNewFeature({ ...newFeature, icon: item.name })}
                                                className={`cursor-pointer p-2 bg-gray-100 rounded hover:bg-gray-200 ${
                                                    newFeature.icon === item.name ? 'border-2 border-blue-500' : ''
                                                }`}
                                                title={item.name}
                                            >
                                                {item.icon}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <input type="file" onChange={handleImageFeature} className="w-full px-4 py-2 border rounded mb-4" />
                                <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded">إضافة / Add</button>
                            </form>
                        </div>
                    )}

                    {activeSection === 'addSection' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">إضافة قسم جديد</h2>
                            <form onSubmit={handleAddSection}>
                                <div className="mb-4 border-b pb-4">
                                    <h3 className="font-medium text-gray-700 mb-2">المحتوى العربي</h3>
                                    <input
                                        type="text"
                                        placeholder="العنوان (عربي)"
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        value={newSection.title_ar}
                                        onChange={(e) => setNewSection({ ...newSection, title_ar: e.target.value })}
                                        required
                                    />
                                    <textarea
                                        placeholder="المحتوى (عربي)"
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        value={newSection.content_ar}
                                        onChange={(e) => setNewSection({ ...newSection, content_ar: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-medium text-gray-700 mb-2">English Content</h3>
                                    <input
                                        type="text"
                                        placeholder="Title (English)"
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        value={newSection.title_en}
                                        onChange={(e) => setNewSection({ ...newSection, title_en: e.target.value })}
                                        required
                                    />
                                    <textarea
                                        placeholder="Content (English)"
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        value={newSection.content_en}
                                        onChange={(e) => setNewSection({ ...newSection, content_en: e.target.value })}
                                        required
                                    />
                                </div>

                                <input type="file" onChange={handleImageChange} className="w-full px-4 py-2 border rounded mb-4" />
                                <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded">إضافة / Add</button>
                            </form>
                        </div>
                    )}

                    {activeSection === 'blog' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">إضافة مدونة و نصيحة جديد</h2>
                            <form onSubmit={handleAddBlog}>
                                <div className="mb-4 border-b pb-4">
                                    <h3 className="font-medium text-gray-700 mb-2">المحتوى العربي</h3>
                                    <input
                                        type="text"
                                        placeholder="العنوان (عربي)"
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        value={newBlog.title_ar}
                                        onChange={(e) => setNewBlog({ ...newBlog, title_ar: e.target.value })}
                                        required
                                    />
                                    <textarea
                                        placeholder="المحتوى (عربي)"
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        value={newBlog.content_ar}
                                        onChange={(e) => setNewBlog({ ...newBlog, content_ar: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-medium text-gray-700 mb-2">English Content</h3>
                                    <input
                                        type="text"
                                        placeholder="Title (English)"
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        value={newBlog.title_en}
                                        onChange={(e) => setNewBlog({ ...newBlog, title_en: e.target.value })}
                                        required
                                    />
                                    <textarea
                                        placeholder="Content (English)"
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        value={newBlog.content_en}
                                        onChange={(e) => setNewBlog({ ...newBlog, content_en: e.target.value })}
                                        required
                                    />
                                </div>

                                <input
                                    type="text"
                                    placeholder="رابط المدونة / Blog Link"
                                    className="w-full px-4 py-2 border rounded mb-4"
                                    value={newBlog.link}
                                    onChange={(e) => setNewBlog({ ...newBlog, link: e.target.value })}
                                    required
                                />
                                <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded">إضافة / Add</button>
                            </form>
                        </div>
                    )}

                    {activeSection === 'editSettings' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">تعديل الإعدادات</h2>
                            <form onSubmit={handleSubmitSettings}>
                                <label className="block text-gray-700">الشعار / Logo:</label>
                                <input type="file" onChange={handleLogoChange} className="w-full px-4 py-2 border rounded mb-4" />
                                {settings.logo && typeof settings.logo === 'string' && (
                                    <img src={`http://localhost:8000${settings.logo}`} alt="الشعار الحالي / Current Logo" className="w-20 h-20 mt-2" />
                                )}

                                <div className="mb-4 border-b pb-4">
                                    <h3 className="font-medium text-gray-700 mb-2">العنوان الرئيسي</h3>
                                    <input
                                        type="text"
                                        placeholder="العنوان (عربي)"
                                        name="main_heading_ar"
                                        value={settings.main_heading_ar}
                                        onChange={handleSettingsChange}
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Main Heading (English)"
                                        name="main_heading_en"
                                        value={settings.main_heading_en}
                                        onChange={handleSettingsChange}
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        required
                                    />
                                </div>

                                <div className="mb-4 border-b pb-4">
                                    <h3 className="font-medium text-gray-700 mb-2">النص الرئيسي</h3>
                                    <textarea
                                        name="main_text_ar"
                                        placeholder="النص (عربي)"
                                        value={settings.main_text_ar}
                                        onChange={handleSettingsChange}
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        required
                                    />
                                    <textarea
                                        name="main_text_en"
                                        placeholder="Main Text (English)"
                                        value={settings.main_text_en}
                                        onChange={handleSettingsChange}
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        required
                                    />
                                </div>

                                <div className="mb-4 border-b pb-4">
                                    <h3 className="font-medium text-gray-700 mb-2">نص التذييل</h3>
                                    <input
                                        type="text"
                                        name="footer_text_ar"
                                        placeholder="النص (عربي)"
                                        value={settings.footer_text_ar}
                                        onChange={handleSettingsChange}
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="footer_text_en"
                                        placeholder="Footer Text (English)"
                                        value={settings.footer_text_en}
                                        onChange={handleSettingsChange}
                                        className="w-full px-4 py-2 border rounded mb-4"
                                        required
                                    />
                                </div>

                                <label className="block text-gray-700">صورة عن الموقع / About Image:</label>
                                <input type="file" onChange={handleImageAboutChange} className="w-full px-4 py-2 border rounded mb-4" />
                                {settings.imgabout && typeof settings.imgabout === 'string' && (
                                    <img src={`http://localhost:8000${settings.imgabout}`} alt="صورة الموقع / About Image" className="w-20 h-20 mt-2" />
                                )}

                                <label className="block text-gray-700">لون الخلفية / Background Color:</label>
                                <input
                                    type="color"
                                    name="background_color"
                                    value={settings.background_color}
                                    onChange={handleSettingsChange}
                                    className="w-full px-4 py-2 border rounded mb-4"
                                />

                                <label className="block text-gray-700">لون الأزرار / Button Color:</label>
                                <input
                                    type="color"
                                    name="button_color"
                                    value={settings.button_color}
                                    onChange={handleSettingsChange}
                                    className="w-full px-4 py-2 border rounded mb-4"
                                />

                                <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded">حفظ التعديلات / Save Changes</button>
                            </form>
                        </div>
                    )}

                    {activeSection === 'viewLandingPage' && (
                        <div className="m-6">
                            <LandingPage />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;