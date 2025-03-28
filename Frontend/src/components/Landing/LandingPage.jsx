import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import AboutSection from "./AboutSection";
import ServicesSection from "./ServicesSection";
import BlogSection from "./BlogSection";
import Footer from "./Footer";
import FeaturesSection from "./FeaturesSection";
import { FaNewspaper, FaLanguage } from "react-icons/fa";
import { useTranslation } from "react-i18next"; // إذا كنت تريد استخدام i18n

function LandingPage() {
    const [language, setLanguage] = useState("ar");
    const [settings, setSettings] = useState({
        logo: "",
        background_color: "#fff",
        imgabout: "",
        main_heading_ar: "مرحباً بكم",
        main_heading_en: "Welcome",
        main_text_ar: "نحن هنا لخدمتك",
        main_text_en: "We are here to serve you",
        footer_text_ar: "جميع الحقوق محفوظة",
        footer_text_en: "All rights reserved",
        button_color: "#3193a5",
    });

    const [sections, setSections] = useState([]);
    const [services, setServices] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [features, setFeatures] = useState([]);
    const [fastLinks, setFastLinks] = useState([]);
    const [socialLinks, setSocialLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // دالة تغيير اللغة
    const handleLanguageChange = () => {
        const newLang = language === "ar" ? "en" : "ar";
        setLanguage(newLang);
        localStorage.setItem("language", newLang);
        document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = newLang;
    };

    // جلب البيانات من API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    settingsRes,
                    servicesRes,
                    sectionsRes,
                    blogsRes,
                    featuresRes,
                    fastLinksRes,
                    socialLinksRes,
                ] = await Promise.all([
                    axios.get("http://localhost:8000/api/show"),
                    axios.get("http://localhost:8000/api/services"),
                    axios.get("http://localhost:8000/api/sections"),
                    axios.get("http://localhost:8000/api/blogs"),
                    axios.get("http://localhost:8000/api/features"),
                    axios.get("http://localhost:8000/api/fastlink"),
                    axios.get("http://localhost:8000/api/social"),
                ]);

                setSettings(settingsRes.data);
                setServices(servicesRes.data || []);
                setSections(sectionsRes.data || []);
                setBlogs(blogsRes.data || []);
                setFeatures(featuresRes.data || []);
                setFastLinks(fastLinksRes.data || []);
                setSocialLinks(socialLinksRes.data || []);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError(
                    language === "ar"
                        ? "حدث خطأ أثناء تحميل البيانات."
                        : "Error loading data."
                );
            } finally {
                setLoading(false);
            }
        };

        // جلب اللغة المحفوظة عند التحميل
        const savedLang = localStorage.getItem("language") || "ar";
        setLanguage(savedLang);
        document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = savedLang;

        fetchData();
    }, [language]);

    // دالة لاختيار النص حسب اللغة
    const t = (arText, enText) => {
        return language === "ar" ? arText : enText;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                <p className="mt-4 text-lg font-semibold text-cyan-500">
                    {t("جاري تحميل البيانات...", "Loading data...")}
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-10 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="font-sans" dir={language === "ar" ? "rtl" : "ltr"}>
            <Navbar
                logo={settings?.logo || ""}
                background_color={settings?.background_color || "#fff"}
                buttonColor={settings?.button_color || "#3193a5"}
                language={language}
                onLanguageChange={handleLanguageChange}
            />

            <AboutSection
                imgabout={settings?.imgabout || ""}
                main_heading={t(settings?.main_heading_ar, settings?.main_heading_en)}
                main_text={t(settings?.main_text_ar, settings?.main_text_en)}
                buttonColor={settings?.button_color}
            />

            {services.length > 0 ? (
                <ServicesSection
                    services={services.map(service => ({
                        ...service,
                        title: t(service.title_ar, service.title_en),
                        description: t(service.description_ar, service.description_en)
                    }))}
                    buttonColor={settings?.button_color}
                    title={t("خدماتنا", "Our Services")}
                />
            ) : (
                <p className="text-center p-10">
                    {t("لا توجد خدمات متاحة", "No services available")}
                </p>
            )}

            {features.length > 0 ? (
                <FeaturesSection
                    features={features.map(feature => ({
                        ...feature,
                        title: t(feature.title_ar, feature.title_en),
                        description: t(feature.description_ar, feature.description_en)
                    }))}
                    buttonColor={settings?.button_color}
                    title={t("مميزاتنا", "Our Features")}
                />
            ) : (
                <p className="text-center p-10">
                    {t("لا توجد ميزات متاحة", "No features available")}
                </p>
            )}

            {blogs.length > 0 ? (
                <BlogSection
                    blogs={blogs.map(blog => ({
                        ...blog,
                        title: t(blog.title_ar, blog.title_en),
                        content: t(blog.content_ar, blog.content_en)
                    }))}
                    buttonColor={settings?.button_color}
                    title={t("مدوناتنا", "Our Blogs")}
                />
            ) : (
                <p className="text-center p-10">
                    {t("لا توجد مدونات متاحة", "No blogs available")}
                </p>
            )}

            <section className="py-12 px-8" dir="rtl">

                <div className="container mx-auto text-center">

                    <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center justify-center gap-2">

                        <FaNewspaper className="text-cyan-600 w-6 h-6" />

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
                footer_text={t(settings?.footer_text_ar, settings?.footer_text_en)}
                background_color={settings?.background_color || "#fff"}
                buttonColor={settings?.button_color || "#3193a5"}
                fastLinks={fastLinks.map(link => ({
                    ...link,
                    title: t(link.title_ar, link.title_en)
                }))}
                socialLinks={socialLinks}
                language={language}
            />
        </div>
    );
}

export default LandingPage;