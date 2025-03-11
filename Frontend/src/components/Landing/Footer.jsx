import React from "react";

const Footer = ({ footer_text, background_color, buttonColor }) => {
    return (
        <footer dir="rtl" className="text-white py-8 rounded-lg px-5" style={{ backgroundColor: background_color }}>
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
                <div>
                    <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
                    <ul className="space-y-2">
                        <li><a href className="hover:underline">عن الموقع</a></li>
                        <li><a href className="hover:underline">مزايا التسجيل</a></li>
                        <li><a href className="hover:underline">الخدمات</a></li>
                        <li><a href className="hover:underline">نصائح ومدونات</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-4">معلومات التواصل</h3>
                    <ul className="space-y-2">
                        <li>0590000</li>
                        <li>0590000</li>
                        <li>0590000</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-4">اشترك بالنشرة البريدية</h3>
                    <p className="text-sm mb-4">البريد الإلكتروني</p>
                    <form>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            className="w-full px-4 py-2 mb-4 rounded text-white"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 rounded w-full"
                            style={{ backgroundColor: buttonColor }}
                        >
                            تأكيد الاشتراك
                        </button>
                    </form>
                </div>
            </div>
            <div className="text-center mt-8 text-sm">
                {footer_text}
            </div>
        </footer>
    );
};

export default Footer;