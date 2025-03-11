import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import AboutSection from "./AboutSection";
import FeaturesSection from "./FeaturesSection";
import ServicesSection from "./ServicesSection";
import BlogSection from "./BlogSection";
import Footer from "./Footer";

function LandingPage() {
    const [settings, setSettings] = useState({
        logo: "",
        main_heading: "",
        main_text: "",
        footer_text: "",
        background_color: "",
        button_color: "#4CAF50", // لون الزر الافتراضي
    });

    const [sections, setSections] = useState([]); // حالة لتخزين الأقسام

    // جلب الإعدادات
    useEffect(() => {
        axios.get("http://localhost:8000/api/settings")
            .then((response) => {
                setSettings(response.data);
            })
            .catch((error) => {
                console.error("Error fetching settings:", error);
            });
    }, []);

    // جلب الأقسام
    useEffect(() => {
        axios.get("http://localhost:8000/api/sections")
            .then((response) => {
                setSections(response.data);
            })
            .catch((error) => {
                console.error("Error fetching sections:", error);
            });
    }, []);

    return (
        <div className="font-sans">
            <Navbar logo={settings.logo} background_color={settings.background_color} />
            <AboutSection logo={settings.logo} main_heading={settings.main_heading} main_text={settings.main_text} />
            <FeaturesSection features={[]} />
            <ServicesSection services={[]} />
            <BlogSection blogs={[]} />

            <section className="py-12 px-8" dir="rtl">
                <div className="container mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-8 text-gray-800">الأقسام الجديدة</h2>
                    <div className="grid grid-cols-1  gap-8">
                        {sections.map((section, index) => (
                            <div key={index} className="bg-white shadow-md rounded-lg p-6">
                                <h3 className="text-lg font-bold text-cyan-700 mb-4">{section.title}</h3>
                                <p className="text-gray-700">{section.content}</p>
                                {section.image && (
                                    <img src={`http://localhost:8000${section.image}`} alt={section.title} className="w-full h-32 object-cover mt-4" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer
                footer_text={settings.footer_text}
                background_color={settings.background_color}
                buttonColor={settings.button_color} // تمرير لون الزر
            />
        </div>
    );
}

export default LandingPage;