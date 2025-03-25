import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="w-1/4 bg-cyan-700 text-white p-6">
            <h2 className="text-xl font-bold mb-6">لوحة التحكم الرئيسية</h2>
            <ul className="space-y-4">
                <li className={`p-2 rounded-md cursor-pointer ${location.pathname === "/showpatient" ? "font-bold" : "hover:font-bold"}`}>
                    <Link to="/showpatient">المرضى</Link>
                </li>
                <li className={`p-2 rounded-md cursor-pointer ${location.pathname === "/showmedicines" ? "font-bold" : "hover:font-bold"}`}>
                    <Link to="/showmedicines">الأدوية</Link>
                </li>
                <li className={`p-2 rounded-md cursor-pointer ${location.pathname === "/statistics" ? "font-bold" : "hover:font-bold"}`}>
                    <Link to="/statistics">إحصائيات</Link>
                </li>
                <li className={`p-2 rounded-md cursor-pointer ${location.pathname === "/showprovider" ? "font-bold" : "hover:font-bold"}`}>
                    <Link to="/showprovider">مزود الخدمة</Link>
                </li>
                <li className={`p-2 rounded-md cursor-pointer ${location.pathname === "/showotification" ? "font-bold" : "hover:font-bold"}`}>
                    <Link to="/showotification">الإشعارات</Link>
                </li>
                <li className={`p-2 rounded-md cursor-pointer ${location.pathname === "/showrequests" ? "font-bold" : "hover:font-bold"}`}>
                    <Link to="/showrequests">الطلبات</Link>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;