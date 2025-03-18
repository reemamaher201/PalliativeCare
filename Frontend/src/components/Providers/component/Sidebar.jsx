import React from "react";
import { Link } from "react-router-dom"; // استيراد Link من react-router-dom

const Sidebar = () => {
    return (
        <aside className="w-1/4 bg-cyan-700 text-white p-6">
            <h2 className="text-xl font-bold mb-6">لوحة التحكم الرئيسية</h2>
            <ul className="space-y-4">
                <li className="hover:underline cursor-pointer">إدارة الحالات</li>

                <li className="hover:underline cursor-pointer">
                    <Link to="/provider/patients"> المرضى </Link> {/* رابط جديد */}
                </li>
                <li className="hover:underline cursor-pointer">
                    <Link to="/provider/medicines"> الأدوية </Link> {/* رابط جديد */}
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;