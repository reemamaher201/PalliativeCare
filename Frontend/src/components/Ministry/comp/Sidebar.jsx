import React from "react";
import {Link} from "react-router-dom";


const Sidebar = () => {
    return (
        <aside className="w-1/4 bg-cyan-700 text-white p-6">
            <h2 className="text-xl font-bold mb-6">لوحة التحكم الرئيسية</h2>
            <ul className="space-y-4">
                <li className="hover:underline cursor-pointer"><Link to="/showpatient">المرضى</Link></li>
                <li className="hover:underline cursor-pointer"><Link to="/showmedicines">الأدوية</Link></li>
                <li className="hover:underline cursor-pointer">إحصائيات</li>
                <li className="hover:underline cursor-pointer"><Link to="/showprovider">مزود الخدمة</Link></li>
                <li className="hover:underline cursor-pointer">الإشعارات</li>
            </ul>
        </aside>
    );
};

export default Sidebar;