import React from "react";

const Navbar = () => {
    return (
        <nav dir={"rtl"} className=" rounded-b-xl text-white py-3 px-8" style={{backgroundColor: "#73B0C5"}}>
            <div className="container mx-auto flex justify-between items-center">
                {/* الروابط */}
                <ul className="flex space-x-6">
                    <li>
                        <a href="#" className="hover:underline">
                            حسابي
                        </a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline">
                            نصائح عامة
                        </a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline">
                            الدعم النفسي
                        </a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline">
                            إعدادات الحساب
                        </a>
                    </li>
                </ul>

                {/* الأيقونات */}
                <div className="flex items-center space-x-6">
                    <a href="#" className="text-lg">
                        <i className="fas fa-comment"></i>
                    </a>
                    <a href="#" className="text-lg">
                        <i className="fas fa-bell"></i>
                    </a>
                    <a href="#" className="text-lg">
                        <i className="fas fa-sign-out-alt"></i>
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;