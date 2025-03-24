import React, { useState } from "react";
import { FaLink, FaPhone } from "react-icons/fa";
import axios from "axios"; // تأكد من استيراد axios

const Footer = ({ footer_text, background_color, buttonColor, fastLinks, socialLinks }) => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            const response = await axios.post("http://localhost:8000/api/subscribe", {
                email: email
            });

            setMessage(response.data.message || "تم الاشتراك بنجاح!");
            setEmail("");
        } catch (error) {
            if (error.response) {
                // خطأ من الخادم (مثل بريد مسجل مسبقاً)
                setMessage(error.response.data.message || "حدث خطأ أثناء الاشتراك");
            } else if (error.request) {
                // لم يتم استلام رد من الخادم
                setMessage("لا يوجد اتصال بالخادم، حاول لاحقاً");
            } else {
                // خطأ في إعداد الطلب
                setMessage("حدث خطأ، يرجى المحاولة مرة أخرى");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <footer dir="rtl" className="text-white py-8 rounded-lg px-5" style={{ backgroundColor: background_color }}>
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-right">

                {/* قسم الروابط السريعة */}
                <div>
                    <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
                    <ul className="space-y-2">
                        {fastLinks?.length > 0 ? (
                            fastLinks.map((link, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <FaLink className="text-gray-300" />
                                    <a href={link.link} className="hover:underline" target="_blank" rel="noopener noreferrer">
                                        {link.title}
                                    </a>
                                </li>
                            ))
                        ) : (
                            <li>لا توجد روابط سريعة</li>
                        )}
                    </ul>
                </div>

                {/* قسم معلومات التواصل */}
                <div>
                    <h3 className="text-lg font-bold mb-4">معلومات التواصل</h3>
                    <ul className="space-y-2">
                        {socialLinks?.length > 0 ? (
                            socialLinks.map((social, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <FaPhone className="text-green-400" />
                                    <a href={`tel:${social.social}`} className="hover:underline">
                                        {social.social}
                                    </a>
                                </li>
                            ))
                        ) : (
                            <li>لا توجد معلومات تواصل</li>
                        )}
                    </ul>
                </div>

                {/* قسم النشرة البريدية */}
                <div>
                    <h3 className="text-lg font-bold mb-4">اشترك بالنشرة البريدية</h3>
                    <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                        <div className="mb-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full px-4 py-2 rounded text-gray-800"
                                required
                                dir="ltr" // لاتجاه نص البريد الإلكتروني
                            />
                        </div>
                        <button
                            type="submit"
                            className={`px-4 py-2 rounded w-full ${isLoading ? 'opacity-75' : ''}`}
                            style={{ backgroundColor: buttonColor }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'جاري الإرسال...' : 'تأكيد الاشتراك'}
                        </button>
                        {message && (
                            <p className={`mt-2 text-sm ${
                                message.includes("نجاح") ? "text-green-300" : "text-red-300"
                            }`}>
                                {message}
                            </p>
                        )}
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