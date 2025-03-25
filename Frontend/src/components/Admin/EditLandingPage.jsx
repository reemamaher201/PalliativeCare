import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FaEdit, FaTrash, FaSave,
    FaInfo, FaCheck, FaEye, FaPlus, FaCog, FaTools, FaListAlt, FaBlog, FaBook,
    FaLink, FaPhone, FaTimes, FaUser, FaStar, FaHeart, FaBell, FaComment,
    FaMusic, FaLock, FaPaperPlane, FaClipboard, FaTasks, FaGlobe, FaClipboardList,
    FaChartBar, FaHeartBroken, FaLightbulb, FaPaperclip, FaUserPlus, FaUserTimes
} from "react-icons/fa";

const EditLandingPage = () => {
    const [settings, setSettings] = useState({
        logo: "",
        imgabout: "",
        main_heading: "",
        main_text: "",
        footer_text: "",
        background_color: "#ffffff",
        button_color: "#3193a5",
    });
    const [sections, setSections] = useState([]);
    const [services, setServices] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [features, setFeatures] = useState([]);
    const [socialLinks, setSocialLinks] = useState([]);
    const [fastLinks, setFastLinks] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [editingType, setEditingType] = useState('');

    // جلب البيانات الأولية
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

    // بدء التعديل على عنصر
    const startEditing = (type, item = null) => {
        setEditingType(type);
        setEditingItem(item || getDefaultItem(type));
    };

    // الحصول على عنصر افتراضي حسب النوع
    const getDefaultItem = (type) => {
        switch (type) {
            case 'settings': return { ...settings };
            case 'section': return { title: '', content: '', image: '' };
            case 'service': return { title: '', content: '', image: '' };
            case 'blog': return { title: '', content: '', link: '' };
            case 'feature': return { title: '', content: '', icon: '', image: null };
            case 'social': return { social: '' };
            case 'fastlink': return { title: '', link: '' };
            default: return null;
        }
    };

    // حفظ التعديلات
    const saveChanges = async () => {
        try {
            let response;
            const formData = new FormData();

            // إضافة البيانات إلى formData حسب النوع
            Object.entries(editingItem).forEach(([key, value]) => {
                if (value instanceof File || typeof value === 'string') {
                    formData.append(key, value);
                } else if (typeof value === 'object' && value !== null) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            });

            if (editingItem.id) {
                // تحديث عنصر موجود
                response = await axios.post(`http://localhost:8000/api/${editingType}s/${editingItem.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                // إنشاء عنصر جديد
                response = await axios.post(`http://localhost:8000/api/${editingType}s`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            // تحديث الحالة بعد الحفظ
            updateStateAfterSave(editingType, response.data);

            alert("تم حفظ التغييرات بنجاح");
            cancelEditing();
        } catch (error) {
            console.error("Error saving changes:", error);
            alert("حدث خطأ أثناء حفظ التغييرات");
        }
    };

    // تحديث الحالة بعد الحفظ
    const updateStateAfterSave = (type, newItem) => {
        const updateArray = (array, newItem) => {
            if (newItem.id) {
                const index = array.findIndex(item => item.id === newItem.id);
                if (index >= 0) {
                    return [...array.slice(0, index), newItem, ...array.slice(index + 1)];
                }
                return [...array, newItem];
            }
            return array;
        };

        switch (type) {
            case 'settings':
                setSettings(newItem);
                break;
            case 'section':
                setSections(updateArray(sections, newItem));
                break;
            case 'service':
                setServices(updateArray(services, newItem));
                break;
            case 'blog':
                setBlogs(updateArray(blogs, newItem));
                break;
            case 'feature':
                setFeatures(updateArray(features, newItem));
                break;
            case 'social':
                setSocialLinks(updateArray(socialLinks, newItem));
                break;
            case 'fastlink':
                setFastLinks(updateArray(fastLinks, newItem));
                break;
            default:
                break;
        }
    };

    // حذف عنصر
    const deleteItem = async (type, id) => {
        try {
            await axios.delete(`http://localhost:8000/api/${type}s/${id}`);

            // تحديث الحالة بعد الحذف
            switch (type) {
                case 'section':
                    setSections(sections.filter(item => item.id !== id));
                    break;
                case 'service':
                    setServices(services.filter(item => item.id !== id));
                    break;
                case 'blog':
                    setBlogs(blogs.filter(item => item.id !== id));
                    break;
                case 'feature':
                    setFeatures(features.filter(item => item.id !== id));
                    break;
                case 'social':
                    setSocialLinks(socialLinks.filter(item => item.id !== id));
                    break;
                case 'fastlink':
                    setFastLinks(fastLinks.filter(item => item.id !== id));
                    break;
                default:
                    break;
            }

            alert("تم الحذف بنجاح");
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    // إلغاء التعديل
    const cancelEditing = () => {
        setEditingItem(null);
        setEditingType('');
    };

    // معالجة تغيير الحقول
    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setEditingItem({ ...editingItem, [name]: value });
    };

    // معالجة تغيير الصور
    const handleImageChange = (e) => {
        setEditingItem({ ...editingItem, image: e.target.files[0] });
    };

    return (
        <div className="p-6" dir="rtl">
            {editingItem ? (
                <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                    <h2 className="text-xl font-bold mb-4">
                        {editingItem.id ? 'تعديل' : 'إضافة'} {getTypeName(editingType)}
                    </h2>

                    {/* حقول التعديل المشتركة */}
                    {['title', 'content', 'main_heading', 'main_text', 'footer_text', 'social', 'link'].map(field => (
                        editingItem[field] !== undefined && (
                            <div key={field} className="mb-4">
                                <label className="block text-gray-700 mb-2">{getFieldLabel(field)}</label>
                                {field === 'content' || field === 'main_text' ? (
                                    <textarea
                                        name={field}
                                        value={editingItem[field]}
                                        onChange={handleFieldChange}
                                        className="w-full px-4 py-2 border rounded"
                                        rows="5"
                                    />
                                ) : (
                                    <input
                                        type={field === 'link' ? 'url' : 'text'}
                                        name={field}
                                        value={editingItem[field]}
                                        onChange={handleFieldChange}
                                        className="w-full px-4 py-2 border rounded"
                                    />
                                )}
                            </div>
                        )
                    ))}

                    {/* حقول خاصة بالإعدادات */}
                    {editingType === 'settings' && (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">لون الخلفية</label>
                                <input
                                    type="color"
                                    name="background_color"
                                    value={editingItem.background_color}
                                    onChange={handleFieldChange}
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">لون الأزرار</label>
                                <input
                                    type="color"
                                    name="button_color"
                                    value={editingItem.button_color}
                                    onChange={handleFieldChange}
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>
                        </>
                    )}

                    {/* حقول الصور */}
                    {['logo', 'imgabout', 'image'].map(field => (
                        editingItem[field] !== undefined && (
                            <div key={field} className="mb-4">
                                <label className="block text-gray-700 mb-2">{getFieldLabel(field)}</label>
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-2 border rounded"
                                />
                                {typeof editingItem[field] === 'string' && editingItem[field] && (
                                    <img
                                        src={`http://localhost:8000${editingItem[field]}`}
                                        alt="Current"
                                        className="mt-2 max-h-40"
                                    />
                                )}
                            </div>
                        )
                    ))}

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={cancelEditing}
                            className="px-4 py-2 bg-gray-500 text-white rounded"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={saveChanges}
                            className="px-4 py-2 bg-cyan-500 text-white rounded"
                        >
                            حفظ
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* قسم الإعدادات العامة */}
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">الإعدادات العامة</h2>
                            <button
                                onClick={() => startEditing('settings')}
                                className="px-3 py-1 bg-cyan-500 text-white rounded flex items-center gap-1"
                            >
                                <FaEdit /> تعديل
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold">العنوان الرئيسي:</h3>
                                <p>{settings.main_heading}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">النص الرئيسي:</h3>
                                <p>{settings.main_text}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">نص الفوتر:</h3>
                                <p>{settings.footer_text}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">الشعار:</h3>
                                {settings.logo && (
                                    <img
                                        src={`http://localhost:8000${settings.logo}`}
                                        alt="Logo"
                                        className="h-20 mt-2"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* قسم الأقسام */}
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">الأقسام</h2>
                            <button
                                onClick={() => startEditing('section')}
                                className="px-3 py-1 bg-cyan-500 text-white rounded flex items-center gap-1"
                            >
                                <FaPlus /> إضافة قسم
                            </button>
                        </div>

                        <div className="space-y-4">
                            {sections.map((section, index) => (
                                <div key={index} className="border p-4 rounded relative">
                                    <div className="flex justify-end gap-2 absolute top-2 left-2">
                                        <button
                                            onClick={() => startEditing('section', section)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => deleteItem('section', section.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>

                                    <h3 className="text-lg font-bold">{section.title}</h3>
                                    <p className="text-gray-700">{section.content}</p>
                                    {section.image && (
                                        <img
                                            src={`http://localhost:8000${section.image}`}
                                            alt={section.title}
                                            className="mt-2 max-h-40"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* قسم الخدمات */}
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">الخدمات</h2>
                            <button
                                onClick={() => startEditing('service')}
                                className="px-3 py-1 bg-cyan-500 text-white rounded flex items-center gap-1"
                            >
                                <FaPlus /> إضافة خدمة
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {services.map((service, index) => (
                                <div key={index} className="border p-4 rounded relative">
                                    <div className="flex justify-end gap-2 absolute top-2 left-2">
                                        <button
                                            onClick={() => startEditing('service', service)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => deleteItem('service', service.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>

                                    <h3 className="text-lg font-bold">{service.title}</h3>
                                    <p className="text-gray-700">{service.content}</p>
                                    {service.image && (
                                        <img
                                            src={`http://localhost:8000${service.image}`}
                                            alt={service.title}
                                            className="mt-2 max-h-40"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* قسم المدونات */}
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">المدونات والنصائح</h2>
                            <button
                                onClick={() => startEditing('blog')}
                                className="px-3 py-1 bg-cyan-500 text-white rounded flex items-center gap-1"
                            >
                                <FaPlus /> إضافة مدونة
                            </button>
                        </div>

                        <div className="space-y-4">
                            {blogs.map((blog, index) => (
                                <div key={index} className="border p-4 rounded relative">
                                    <div className="flex justify-end gap-2 absolute top-2 left-2">
                                        <button
                                            onClick={() => startEditing('blog', blog)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => deleteItem('blog', blog.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>

                                    <h3 className="text-lg font-bold">{blog.title}</h3>
                                    <p className="text-gray-700">{blog.content}</p>
                                    {blog.link && (
                                        <a href={blog.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            عرض المدونة
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* قسم مزايا التسجيل */}
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">مزايا التسجيل</h2>
                            <button
                                onClick={() => startEditing('feature')}
                                className="px-3 py-1 bg-cyan-500 text-white rounded flex items-center gap-1"
                            >
                                <FaPlus /> إضافة ميزة
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <div key={index} className="border p-4 rounded relative">
                                    <div className="flex justify-end gap-2 absolute top-2 left-2">
                                        <button
                                            onClick={() => startEditing('feature', feature)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => deleteItem('feature', feature.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>

                                    <h3 className="text-lg font-bold">{feature.title}</h3>
                                    <p className="text-gray-700">{feature.content}</p>
                                    {feature.image && (
                                        <img
                                            src={`http://localhost:8000${feature.image}`}
                                            alt={feature.title}
                                            className="mt-2 max-h-40"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* قسم روابط التواصل */}
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">روابط التواصل</h2>
                            <button
                                onClick={() => startEditing('social')}
                                className="px-3 py-1 bg-cyan-500 text-white rounded flex items-center gap-1"
                            >
                                <FaPlus /> إضافة رابط
                            </button>
                        </div>

                        <div className="space-y-2">
                            {socialLinks.map((social, index) => (
                                <div key={index} className="border p-3 rounded relative">
                                    <div className="flex justify-end gap-2 absolute top-2 left-2">
                                        <button
                                            onClick={() => startEditing('social', social)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => deleteItem('social', social.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>

                                    <p className="text-gray-700">{social.social}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* قسم الروابط السريعة */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">الروابط السريعة</h2>
                            <button
                                onClick={() => startEditing('fastlink')}
                                className="px-3 py-1 bg-cyan-500 text-white rounded flex items-center gap-1"
                            >
                                <FaPlus /> إضافة رابط
                            </button>
                        </div>

                        <div className="space-y-2">
                            {fastLinks.map((link, index) => (
                                <div key={index} className="border p-3 rounded relative">
                                    <div className="flex justify-end gap-2 absolute top-2 left-2">
                                        <button
                                            onClick={() => startEditing('fastlink', link)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => deleteItem('fastlink', link.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>

                                    <h3 className="font-bold">{link.title}</h3>
                                    <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        {link.link}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// دالة مساعدة للحصول على اسم النوع
const getTypeName = (type) => {
    const names = {
        'settings': 'الإعدادات',
        'section': 'قسم',
        'service': 'خدمة',
        'blog': 'مدونة',
        'feature': 'ميزة',
        'social': 'رابط تواصل',
        'fastlink': 'رابط سريع'
    };
    return names[type] || type;
};

// دالة مساعدة للحصول على تسمية الحقل
const getFieldLabel = (field) => {
    const labels = {
        'title': 'العنوان',
        'content': 'المحتوى',
        'main_heading': 'العنوان الرئيسي',
        'main_text': 'النص الرئيسي',
        'footer_text': 'نص الفوتر',
        'social': 'رابط التواصل',
        'link': 'الرابط',
        'logo': 'الشعار',
        'imgabout': 'صورة عن الموقع',
        'image': 'الصورة'
    };
    return labels[field] || field;
};

export default EditLandingPage;