import React from "react";
import { Link } from "react-router-dom";
import { FaLanguage } from "react-icons/fa";

const Navbar = ({ logo, background_color, onLanguageChange }) => {
    return (
        <nav dir="rtl" className="bg-cyan-700 text-white py-4 px-8 rounded-lg" style={{ backgroundColor: background_color }}>
            <div className="container mx-auto flex justify-between items-center">
                {logo ? (
                    <img
                        src={logo}
                        alt="logo"
                        className="rounded-lg w-15 h-15"
                    />
                ) : (
                    <span> <img
                        src='../../assets/logo.png'
                        alt="logo"
                        className="rounded-lg w-15 h-15"
                    /></span>
                )}
                <ul className="flex space-x-8">
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
                <div className="flex items-center space-x-4">
                    <button onClick={onLanguageChange} className="flex items-center bg-white text-cyan-600 px-4 py-2 rounded">
                        <FaLanguage className="mr-2" />
                        ترجمة
                    </button>
                    <Link to="/login">
                        <button className="bg-white text-cyan-600 px-4 py-2 rounded">تسجيل حساب</button>
                    </Link>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;