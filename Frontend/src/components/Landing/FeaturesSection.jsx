import React from "react";

const FeaturesSection = () => {
    const features = [
        {
            title: "الوزارة",
            image: "src/assets/logoo.png",
            points: [
                "إدارة وتوجيه العيادات الصحية",
                "تقديم الدعم النفسي والاجتماعي",
                "توفير الأدوية والمستلزمات الطبية",
            ],
        },
        {
            title: "مزود الرعاية",
            image: "src/assets/logoo.png",
            points: [
                "التواصل المباشر مع المرضى وأسرهم",
                "إدارة العيادات بفعالية",
                "توفير الرعاية التلطيفية والاستشارات",
            ],
        },
        {
            title: "المريض",
            image: "src/assets/logoo.png",
            points: [
                "سهولة الوصول إلى الخدمات",
                "دعم نفسي متكامل",
                "استشارات طبية موثوقة",
            ],
        },
    ];

    return (
        <section className="py-12 px-8" dir="rtl">
            <div className="container mx-auto text-center">
                <h2 className="text-2xl font-bold mb-8 text-gray-800">مزايا التسجيل</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-md rounded-lg overflow-hidden"
                        >
                            <div className="flex flex-col items-center">
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="w-full h-32 object-cover"
                                />
                                <h3 className="text-lg font-bold mt-4 text-cyan-700">
                                    {feature.title}
                                </h3>
                            </div>
                            <ul className="text-right p-4 space-y-2 text-gray-700">
                                {feature.points.map((point, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <span className="text-cyan-500 font-bold mr-2">•</span>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;