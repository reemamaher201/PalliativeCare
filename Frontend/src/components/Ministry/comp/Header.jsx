import React from "react";


const Header = () => {
    return (
        <div>
            {/* الشريط العلوي */}
            <header className="flex justify-between items-center p-4 bg-white shadow">
                <span className="text-lg font-semibold">أحمد محمد</span>
                <div className="flex space-x-4">
                    <i className="fas fa-bell text-gray-500 text-lg cursor-pointer"></i>
                    <i className="fas fa-envelope text-gray-500 text-lg cursor-pointer"></i>
                </div>

            </header>
        </div>
    );
};

export default Header;