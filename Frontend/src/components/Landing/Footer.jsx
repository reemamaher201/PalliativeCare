import React from "react";

const Footer = () => {
    return (
        <footer dir="rtl" className="bg-cyan-700 text-white py-8  rounded-lg px-5" >
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
                {/* الروابط السريعة */}
                <div>
                    <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
                    <ul className="space-y-2">
                        <li><a href className="hover:underline">عن الموقع</a></li >
                        <li><a href className="hover:underline">مزايا التسجيل</a></li>
                        <li><a href className="hover:underline">الخدمات</a></li>
                        <li><a href className="hover:underline">نصائح ومدونات</a></li>
                    </ul>
</div>

    {/* معلومات التواصل */}
    <div>
        <h3 className="text-lg font-bold mb-4">معلومات التواصل</h3>
        <ul className="space-y-2">
            <li>0590000</li>
            <li>0590000</li>
            <li>0590000</li>
        </ul>
    </div>

    {/* الاشتراك بالنشرة البريدية */}
    <div>
        <h3 className="text-lg font-bold mb-4">اشترك بالنشرة البريدية</h3>
        <p className="text-sm mb-4">البريد الإلكتروني</p>
        <form>
            <input
                type="email"
                placeholder="name@example.com"
                className="w-full px-4 py-2 mb-4 rounded text-white"
            />
            <button              type="submit"
                                 className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded w-full"
            >
                تأكيد الاشتراك
            </button   >       </form>
    </div>
</div>

    {/* حقوق الطبع */}
    <div className="text-center mt-8 text-sm">
        حقوق الطبع محفوظة
    </div>
</footer > );
};

export default Footer;