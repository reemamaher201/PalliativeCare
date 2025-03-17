import React from "react";
import { Link } from "react-router-dom"; // استيراد Link من react-router-dom

const Sidebar = () => {
    return (
        <aside className="w-1/4 bg-cyan-700 text-white p-6">
            <h2 className="text-xl font-bold mb-6">لوحة التحكم الرئيسية</h2>
            <ul className="space-y-4">
                <li className="hover:underline cursor-pointer">إدارة الحالات</li>
                <li className="hover:underline cursor-pointer"><Link to={"/med/request"}>اضافة دواء</Link></li>
                <li className="hover:underline cursor-pointer">
                    <Link to="/patients/request">إضافة مريض</Link> {/* رابط إضافة مريض */}
                </li>
                <li className="hover:underline cursor-pointer">
                    <Link to="/provider/patients"> المرضى الذين تمت إضافتهم</Link> {/* رابط جديد */}
                </li>
                <li className="hover:underline cursor-pointer">
                    <Link to="/provider/medicines"> الادوية الذين تمت إضافتهم</Link> {/* رابط جديد */}
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;