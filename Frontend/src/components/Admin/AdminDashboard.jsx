import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandingPage from '../Landing/LandingPage';
import {
    FaInfo,
    FaCheck,
    FaEye,
    FaPlus,
    FaCog,
    FaTools,
    FaListAlt,
    FaBlog,
    FaBook,
    FaLink,
    FaPhone,
    FaTimes,
    FaUser,
    FaStar,
    FaHeart,
    FaBell,
    FaComment,
    FaMusic,
    FaLock,
    FaPaperPlane,
    FaClipboard,
    FaTasks,
    FaGlobe,
    FaClipboardList,
    FaChartBar,
    FaHeartBroken,
    FaLightbulb,
    FaPaperclip,
    FaUserPlus,
    FaUserTimes
} from "react-icons/fa"; // Font Awesome

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('viewLandingPage'); // القسم النشط
    const [newSection, setNewSection] = useState({ title: '', content: '', image: '' }); // بيانات القسم الجديد
    const [newService,setNewService] = useState({title: '', content: '', image: '' });
    const [newBlog, setNewBlog] = useState({title: '', content: '', link: '' });
    const [settings, setSettings] = useState({
        logo: "",
        imgabout:"",
        main_heading: "",
        main_text: "",
        footer_text: "",
        background_color: "#ffffff",
        button_color: "#3193a5", // لون الزر الافتراضي
    }); // بيانات الإعدادات
    const [newFeature, setNewFeature] = useState({
        title: '',
        content: '',
        icon: '',
        image: null
    });
    const [newSocial, setNewSocial] = useState('');
    const [newLink, setNewLink] = useState('');
    const handleAddSocial = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8000/api/social", newSocial);
            alert("تمت إضافة رقم التواصل بنجاح");
            setNewSocial({ social: '' });
        } catch (error) {
            console.error("Error adding social:", error);
        }
    };
    const handleAddLink = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8000/api/fastlink", newLink);
            alert("تمت إضافة الرابط بنجاح");
            setNewLink({title:'',link: ''});
        } catch (error) {
            console.error("Error adding fastlink:", error);
        }
    };

    const handleImageFeature = (e) => {
        setNewFeature({ ...newFeature, image: e.target.files[0] });
    };

    const handleAddFeature = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', newFeature.title);
        formData.append('content', newFeature.content);
        formData.append('icon', newFeature.icon);
        if (newFeature.image) {
            formData.append('image', newFeature.image);
        }
        try {
            await axios.post("http://localhost:8000/api/features", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert("تمت إضافة الميزة بنجاح");
            setNewFeature({ title: '', content: '', icon: '', image: null }); // إعادة تعيين الحقول
        } catch (error) {
            console.error("Error adding Features:", error);
        }
    };

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
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSettings({ ...settings, logo: file });
        }
    };
    const handleImageAboutChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSettings({ ...settings, imgabout: file });
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
            await axios.post("http://localhost:8000/api/sections", formData, {
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
    const handleAddService = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', newService.title);
        formData.append('content', newService.content);
        if (newService.image) {
            formData.append('image', newService.image);
        }
        try {
            await axios.post("http://localhost:8000/api/services", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert("تمت إضافة الخدمة بنجاح");
            setNewService({ title: '', content: '', image: null }); // إعادة تعيين الحقول
        } catch (error) {
            console.error("Error adding service:", error);
        }
    };

    const handleAddBlog = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8000/api/blogs", newBlog);
            alert("تمت إضافة المدونة بنجاح");
            setNewBlog({ title: '', content: '', link: '' });
        } catch (error) {
            console.error("Error adding blog:", error);
        }
    };
    const handleImageChange = (e) => {
        setNewSection({ ...newSection, image: e.target.files[0] });
    };
    const handleImageService = (e) => {
        setNewService({ ...newService, image: e.target.files[0] });
    };

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
        if (settings.imgabout instanceof File) {
            formData.append('imgabout', settings.imgabout);
        }
        try {
            await axios.post("http://localhost:8000/api/settings/update", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert("تم حفظ التعديلات بنجاح");
        } catch (error) {
            console.error("Error updating settings:", error);
        }
    };


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
                    axios.get("http://localhost:8000/api/fastlinks")
                ]);

                setSettings(settingsRes.data);
                setSections(sectionsRes.data || []);
                setServices(servicesRes.data || []);
                setBlogs(blogsRes.data || []);
                setFeatures(featuresRes.data || []);
                setSocialLinks(socialRes.data || []);
                setFastLinks(linksRes.data || []);
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
            {/* الشريط الجانبي */}
            <aside className="w-1/4 bg-cyan-700 text-white p-6 flex flex-col">
                <h2 className="text-xl font-bold mb-6">لوحة التحكم الرئيسية</h2>
                <ul className="space-y-6 text-right">
                    <li className={`cursor-pointer flex items-center justify-center hover:underline mb-6 ${activeSection === 'viewLandingPage' ? 'font-bold' : ''}`} onClick={() => setActiveSection('viewLandingPage')}>
                        <FaEye className="ml-2" />
                        عرض صفحة الهبوط
                    </li>
                    <li className={`cursor-pointer flex items-center justify-center hover:underline mb-6 ${activeSection === 'addSection' ? 'font-bold' : ''}`} onClick={() => setActiveSection('addSection')}>
                        <FaPlus className="ml-2" />
                        قسم جديد
                    </li>
                    <li className={`cursor-pointer flex items-center justify-center hover:underline mb-6 ${activeSection === 'editSettings' ? 'font-bold' : ''}`} onClick={() => setActiveSection('editSettings')}>
                        <FaCog className="ml-2" />
                        الإعدادات
                    </li>
                    <li className={`cursor-pointer flex items-center justify-center hover:underline mb-6 ${activeSection === 'addServices' ? 'font-bold' : ''}`} onClick={() => setActiveSection('addServices')}>
                        <FaTools className="ml-2" />
                        الخدمات
                    </li>
                    <li className={`cursor-pointer flex items-center justify-center hover:underline mb-6 ${activeSection === 'features' ? 'font-bold' : ''}`} onClick={() => setActiveSection('features')}>
                        <FaListAlt className="ml-2" />
                        مزايا التسجيل
                    </li>

                    {/* حقل المدونة الجديد */}
                    <li className={`cursor-pointer flex items-center justify-center hover:underline mb-6 ${activeSection === 'blog' ? 'font-bold' : ''}`} onClick={() => setActiveSection('blog')}>
                        <FaBook className="ml-2" />
                        النصائح و المدونات
                    </li>
                    <li className={`cursor-pointer flex items-center justify-center hover:underline mb-6 ${activeSection === 'fastLink' ? 'font-bold' : ''}`} onClick={() => setActiveSection('fastLink')}>
                        <FaLink className="ml-2" />
                     الروابط السريعة
                    </li>
                    <li className={`cursor-pointer flex items-center justify-center hover:underline mb-6 ${activeSection === 'social' ? 'font-bold' : ''}`} onClick={() => setActiveSection('social')}>
                        <FaPhone className="ml-2" />
                        معلومات التواصل
                    </li>
                    <li className={`cursor-pointer flex items-center justify-center hover:underline mb-6 ${activeSection === 'editPage' ? 'font-bold' : ''}`} onClick={() => setActiveSection('editPage')}>
                        <FaPhone className="ml-2" />
                        معلومات التواصل
                    </li>
                </ul>
            </aside>

            {/* المحتوى الرئيسي */}
            <main className="flex-1 flex flex-col">
                <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
                    <h1 className="text-xl font-bold">أدمن</h1>
                    <button className="text-cyan-700 hover:text-cyan-600">
                        <i className="fas fa-sign-out-alt text-xl"></i>
                    </button>
                </header>

                <div className="flex-1 p-6 overflow-auto">
                    {activeSection === 'addServices' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">إضافة خدمة جديدة</h2>
                            <form onSubmit={handleAddService}>
                                <input type="text" placeholder="العنوان" className="w-full px-4 py-2 border rounded mb-4"
                                       value={newService.title} onChange={(e) => setNewService({ ...newService, title: e.target.value })} required />
                                <textarea placeholder="المحتوى" className="w-full px-4 py-2 border rounded mb-4"
                                          value={newService.content} onChange={(e) => setNewService({ ...newService, content: e.target.value })} required />
                                <input type="file" onChange={handleImageService} className="w-full px-4 py-2 border rounded mb-4" />
                                <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded">إضافة</button>
                            </form>
                        </div>
                    )}

                    {activeSection === 'social' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">إضافة رقم تواصل</h2>
                            <form onSubmit={handleAddSocial}>
                                <input type="text" placeholder=" رقم التواصل" className="w-full px-4 py-2 border rounded mb-4"
                                       value={newSocial.title} onChange={(e) => setNewSocial({ ...newSocial, social: e.target.value })} required />
                                   <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded">إضافة</button>
                            </form>
                        </div>
                    )}


                    {activeSection === 'fastLink' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">إضافة روابط سريعة</h2>
                            <form onSubmit={handleAddLink}>
                                <input type="text" placeholder="العنوان" className="w-full px-4 py-2 border rounded mb-4"
                                       value={newLink.title} onChange={(e) => setNewLink({ ...newLink, title: e.target.value })} required />
                                <input type="text" placeholder="الرابط" className="w-full px-4 py-2 border rounded mb-4"
                                       value={newLink.link} onChange={(e) => setNewLink({ ...newLink, link: e.target.value })} required />
                                <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded">إضافة</button>
                            </form>
                        </div>
                    )}
                    {activeSection === 'features' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">إضافة ميزة جديدة</h2>
                            <form onSubmit={handleAddFeature}>
                                <input
                                    type="text"
                                    placeholder="العنوان"
                                    className="w-full px-4 py-2 border rounded mb-4"
                                    value={newFeature.title}
                                    onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                                    required
                                />
                                <textarea
                                    placeholder="المحتوى"
                                    className="w-full px-4 py-2 border rounded mb-4"
                                    value={newFeature.content}
                                    onChange={(e) => setNewFeature({ ...newFeature, content: e.target.value })}
                                    required
                                />
                                <div className="mb-4">
                                    <label className="block mb-2">اختر أيقونة:</label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableIcons.map((item, index) => (
                                            <div
                                                key={index}
                                                onClick={() => setNewFeature({ ...newFeature, icon: item.name })}
                                                className={`cursor-pointer p-2 bg-gray-100 rounded hover:bg-gray-200 ${
                                                    newFeature.icon === item.name ? 'border-2 border-blue-500' : ''
                                                }`}
                                                title={item.name} // لإظهار الاسم عند تمرير الفأرة
                                            >
                                                {item.icon}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <input type="file" onChange={handleImageFeature} className="w-full px-4 py-2 border rounded mb-4" />
                                <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded">إضافة</button>
                            </form>
                        </div>
                    )}
                    {activeSection === 'addSection' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">إضافة قسم جديد</h2>
                            <form onSubmit={handleAddSection}>
                                <input type="text" placeholder="العنوان" className="w-full px-4 py-2 border rounded mb-4"
                                       value={newSection.title} onChange={(e) => setNewSection({ ...newSection, title: e.target.value })} required />
                                <textarea placeholder="المحتوى" className="w-full px-4 py-2 border rounded mb-4"
                                          value={newSection.content} onChange={(e) => setNewSection({ ...newSection, content: e.target.value })} required />
                                <input type="file" onChange={handleImageChange} className="w-full px-4 py-2 border rounded mb-4" />
                                <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded">إضافة</button>
                            </form>
                        </div>
                    )}
                    {activeSection === 'blog' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">إضافة مدونة و نصيحة جديد</h2>
                            <form onSubmit={handleAddBlog}>
                                <input type="text" placeholder="العنوان" className="w-full px-4 py-2 border rounded mb-4"
                                       value={newBlog.title} onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} required />
                                <textarea placeholder="المحتوى" className="w-full px-4 py-2 border rounded mb-4"
                                          value={newBlog.content} onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })} required />
                                <input type="text" placeholder="رابط المدونة" className="w-full px-4 py-2 border rounded mb-4"
                                       value={newBlog.link} onChange={(e) => setNewBlog({ ...newBlog, link: e.target.value })} required />                                <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded">إضافة</button>
                            </form>
                        </div>
                    )}

                    {activeSection === 'editSettings' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">تعديل الإعدادات</h2>
                            <form onSubmit={handleSubmitSettings}>
                                <label className="block text-gray-700">الشعار:</label>
                                <input type="file" onChange={handleLogoChange} className="w-full px-4 py-2 border rounded mb-4" />
                                {settings.logo && typeof settings.logo === 'string' && <img src={`http://localhost:8000${settings.logo}`} alt="الشعار الحالي" className="w-20 h-20 mt-2" />}

                                <label className="block text-gray-700">العنوان الرئيسي:</label>
                                <input type="text" name="main_heading" value={settings.main_heading} onChange={handleSettingsChange} className="w-full px-4 py-2 border rounded mb-4" />

                                <label className="block text-gray-700">النص الرئيسي:</label>
                                <textarea name="main_text" value={settings.main_text} onChange={handleSettingsChange} className="w-full px-4 py-2 border rounded mb-4" />

                                <label className="block text-gray-700">عن الموقع:</label>
                                <input type="file" onChange={handleImageAboutChange} className="w-full px-4 py-2 border rounded mb-4" />
                                {settings.imgabout && typeof settings.imgabout === 'string' && <img src={`http://localhost:8000${settings.imgabout}`} alt="الموضوع الحالي" className="w-20 h-20 mt-2" />}

                                <label className="block text-gray-700">لون الخلفية:</label>
                                <input type="color" name="background_color" value={settings.background_color} onChange={handleSettingsChange} className="w-full px-4 py-2 border rounded mb-4" />

                                <label className="block text-gray-700">لون الأزرار:</label>
                                <input type="color" name="background_color" value={settings.button_color} onChange={handleSettingsChange} className="w-full px-4 py-2 border rounded mb-4" />


                                <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded">حفظ التعديلات</button>
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