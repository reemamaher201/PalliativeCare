// import React, {useEffect} from "react";
// import Navbar from "./Navbar.jsx";
// import AboutSection from "./AboutSection.jsx";
// import FeaturesSection from "./FeaturesSection.jsx";
// import ServicesSection from "./ServicesSection.jsx";
// import BlogSection from "./BlogSection.jsx";
// import Footer from "./Footer.jsx";
// import '../../App.css'
//
// function LandingPage() {
//     useEffect(() => {
//         document.title = "الصفحة الرئيسية";
//     }, []);
//     return (
//
//         <div className="font-sans">
//             <Navbar   />   <AboutSection />    <FeaturesSection />
//             <ServicesSection />
//             <BlogSection     /> <Footer />  </div>
//     );
// }
//
// export default LandingPage;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "./Navbar.jsx";
import AboutSection from "./AboutSection.jsx";
import FeaturesSection from "./FeaturesSection.jsx";
import ServicesSection from "./ServicesSection.jsx";
import BlogSection from "./BlogSection.jsx";
import Footer from "./Footer.jsx";
import '../../App.css';

function LandingPage() {
    const [landingPage, setLandingPage] = useState({
        title: '',
        description: '',
        image: null,
        sections: [],
        colors: { primary: '#06b6d4', secondary: '#ffffff' },
    });

    useEffect(() => {
        fetchLandingPage();
    }, []);

    const fetchLandingPage = async () => {
        try {
            const response = await axios.get('/api/admin/landing-page');
            setLandingPage(response.data);
        } catch (error) {
            console.error('فشل في جلب بيانات صفحة الهبوط:', error);
        }
    };

    return (
        <div className="font-sans" style={{ backgroundColor: landingPage.colors.secondary }}>
            <Navbar colors={landingPage.colors} />
            <AboutSection landingPage={landingPage} />
            <FeaturesSection sections={landingPage.sections} />
            <ServicesSection services={landingPage.sections} />
            <BlogSection blogs={landingPage.sections} />
            <Footer colors={landingPage.colors} />
        </div>
    );
}

export default LandingPage;