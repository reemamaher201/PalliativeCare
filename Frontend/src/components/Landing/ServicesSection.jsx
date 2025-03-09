import React from "react";

const ServicesSection = () => {
    const services = [
        {
            title: "الاستشارات الطبية",
            icon: "src/assets/logoo.png", // استبدل هذا الرابط برابط الأيقونة الفعلية
        },
        {
            title: "الاستشارات الطبية",
            icon: "src/assets/logoo.png", // استبدل هذا الرابط برابط الأيقونة الفعلية
        },
        {
            title: "الدعم النفسي",
            icon: "src/assets/logoo.png", // استبدل هذا الرابط برابط الأيقونة الفعلية
        },
        {
            title: "توفير الأدوية",
            icon: "src/assets/logoo.png", // استبدل هذا الرابط برابط الأيقونة الفعلية
        },
        {
            title: "الاستشارات الطبية",
            icon: "src/assets/logoo.png", // استبدل هذا الرابط برابط الأيقونة الفعلية
        },
        {
            title: "الاستشارات الطبية",
            icon: "src/assets/logoo.png", // استبدل هذا الرابط برابط الأيقونة الفعلية
        },
    ];

    return (
        <section dir  = "rtl" className="py-12 px-8">
            <div className="container mx-auto text-center">
                <h2 className="text-2xl font-bold mb-8 text-gray-800">الخدمات</h2>
                <div className="flex items-center justify-between">
                    {/* زر السهم الأيسر */}
                    <button className="text-cyan-500 text-2xl hover:text-cyan-700">
                        ️➡️️
                    </button>

                    {/* البطاقات */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center"
                            >
                                <img
                                    src={service.icon}
                                    alt={service.title}
                                    className="w-20 h-20 mb-4"
                                />
                                <h3 className="text-lg font-bold text-cyan-700">
                                    {service.title}
                                </h3>
                            </div>
                        ))}
                    </div>

                    {/* زر السهم الأيمن */}
                    <button className="text-cyan-500 text-2xl hover:text-cyan-700">
                       ⬅️
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;