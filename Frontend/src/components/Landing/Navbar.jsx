import React from "react";
import { Link } from "react-router-dom"; // استيراد Link

const Navbar = () => {
    return (
        <nav dir="rtl" className="bg-cyan-700 text-white py-4 px-8 rounded-lg">
            <div className="container mx-auto flex justify-between items-center">
                <img
                    src="src/assets/logo.png" // استبدل هذا الرابط برابط الصورة الفعلي
                    alt="logo"
                    className="rounded-lg w-15 h-15" // ضبط الحجم هنا
                />
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/" className="hover:underline">الصفحة الرئيسية</Link>
                    </li>
                    <li>
                        <Link to="/features" className="hover:underline">مزايا التسجيل</Link>
                    </li>
                    <li>
                        <Link to="/services" className="hover:underline">الخدمات</Link>
                    </li>
                    <li>
                        <Link to="/blog" className="hover:underline">نصائح ومدونات</Link>
                    </li>
                </ul>
                <Link to="/login">
                    <button className="bg-white text-cyan-600 px-4 py-2 rounded">تسجيل حساب</button>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;