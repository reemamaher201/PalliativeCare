import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import AboutSection from "./AboutSection";
import ServicesSection from "./ServicesSection";
import BlogSection from "./BlogSection";
import Footer from "./Footer";
import FeaturesSection from "./FeaturesSection.jsx";
import { FaNewspaper } from "react-icons/fa";

function LandingPage() {
    const [settings, setSettings] = useState(null);
    const [sections, setSections] = useState([]);
    const [services, setServices] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [features, setFeatures] = useState([]);
    const [fastLinks, setFastLinks] = useState([]); // ✅ إضافة حالة للروابط السريعة
    const [socialLinks, setSocialLinks] = useState([]); // ✅ إضافة حالة لروابط التواصل
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        async function fetchData() {
            try {
                const [
                    settingsRes,
                    servicesRes,
                    sectionsRes,
                    blogRes,
                    featuresRes,
                    fastLinksRes,
                    socialLinksRes
                ] = await Promise.all([
                    axios.get("http://localhost:8000/api/show"),
                    axios.get("http://localhost:8000/api/services"),
                    axios.get("http://localhost:8000/api/sections"),
                    axios.get("http://localhost:8000/api/blogs"),
                    axios.get("http://localhost:8000/api/features"),
                    axios.get("http://localhost:8000/api/fastlink"), // ✅ جلب الروابط السريعة
                    axios.get("http://localhost:8000/api/social"), // ✅ جلب روابط التواصل
                ]);

                setSettings(settingsRes.data);
                setServices(servicesRes.data || []);
                setSections(sectionsRes.data || []);
                setBlogs(blogRes.data || []);
                setFeatures(featuresRes.data || []);
                setFastLinks(fastLinksRes.data || []);
                setSocialLinks(socialLinksRes.data || []);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("حدث خطأ أثناء تحميل البيانات.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                <p className="mt-4 text-lg font-semibold text-cyan-500">جاري تحميل البيانات...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    return (
        <div className="font-sans">
            <Navbar logo={settings?.logo || ""} background_color={settings?.background_color || "#fff"} />

            <AboutSection imgabout={settings?.imgabout || ""} main_heading={settings?.main_heading || "مرحبًا بكم"} main_text={settings?.main_text || "نحن هنا لخدمتك"} />

            {services.length > 0 ? <ServicesSection services={services} /> : <p className="text-center p-10">لا توجد خدمات متاحة</p>}
            {features.length > 0 ? <FeaturesSection features={features} /> : <p className="text-center p-10">لا توجد ميزات متاحة</p>}
            {blogs.length > 0 ? <BlogSection blogs={blogs} /> : <p className="text-center p-10">لا توجد مدونات متاحة</p>}
            <section className="py-12 px-8" dir="rtl">

                <div className="container mx-auto text-center">

                    <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center justify-center gap-2">

                        <FaNewspaper className="text-cyan-600 w-6 h-6" /> {/* أيقونة الأقسام الجديدة */}

                        الأقسام الجديدة

                    </h2>

                    <div className="grid grid-cols-1 gap-8">

                        {sections.length > 0 ? (

                            sections.map((section, index) => (

                                <div key={index} className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-8">

                                    <div className="w-full md:w-1/2">

                                        <h3 className="text-lg font-bold text-cyan-700 mb-4">{section.title}</h3>

                                        <p className="text-gray-700">{section.content}</p>

                                    </div>

                                    <div className="w-full md:w-1/2 flex justify-center">

                                        {section.image ? (

                                            <img

                                                src={section.image}

                                                alt={section.title}

                                                className="w-full h-70 object-cover rounded-lg shadow-md"

                                            />

                                        ) : (

                                            <p>الصورة غير متاحة</p>

                                        )}

                                    </div>

                                </div>

                            ))

                        ) : (

                            <p className="text-gray-600">لا توجد أقسام متاحة</p>

                        )}

                    </div>

                </div>

            </section>
            <Footer
                footer_text={settings?.footer_text || "جميع الحقوق محفوظة"}
                background_color={settings?.background_color || "#fff"}
                buttonColor={settings?.button_color || "#4CAF50"}
                fastLinks={fastLinks} // ✅ تمرير الروابط السريعة للفوتر
                socialLinks={socialLinks} // ✅ تمرير روابط التواصل للفوتر
            />
        </div>
    );
}

export default LandingPage;
