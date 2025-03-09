import React from "react";

const BlogSection = () => {
    const blogs = [
        {
            title: "ما هي الرعاية التلطيفية؟ وأهميتها في حياة المرضى.",
            points: [
                "أبرز المفاهيم الخاطئة حول الرعاية التلطيفية.",
                "دور الرعاية التلطيفية في تحسين جودة الحياة.",
                "كيف تكتسب الرعاية التلطيفية التناسب النفسي والاجتماعي.",
                "الرعاية التلطيفية في ظل الأزمات والكوارث.",
            ],
        },
        {
            title: "ما هي الرعاية التلطيفية؟ وأهميتها في حياة المرضى.",
            points: [
                "أبرز المفاهيم الخاطئة حول الرعاية التلطيفية.",
                "دور الرعاية التلطيفية في تحسين جودة الحياة.",
                "كيف تكتسب الرعاية التلطيفية التناسب النفسي والاجتماعي.",
                "الرعاية التلطيفية في ظل الأزمات والكوارث.",
            ],
        },
        {
            title: "ما هي الرعاية التلطيفية؟ وأهميتها في حياة المرضى.",
            points: [
                "أبرز المفاهيم الخاطئة حول الرعاية التلطيفية.",
                "دور الرعاية التلطيفية في تحسين جودة الحياة.",
                "كيف تكتسب الرعاية التلطيفية التناسب النفسي والاجتماعي.",
                "الرعاية التلطيفية في ظل الأزمات والكوارث.",
            ],
        },
    ];

    return (
        <section dir = "rtl" className="py-12 px-8">
            <div className="container mx-auto text-center">
                <h2 className="text-2xl font-bold mb-8 text-gray-800">نصائح ومدونات</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogs.map((blog, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-md rounded-lg p-6 text-right"
                        >
                            <h3 className="text-lg font-bold text-cyan-700 mb-4">
                                {blog.title}
                            </h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                {blog.points.map((point, idx) => (
                                    <li key={idx}>{point}</li>
                                ))}
                            </ul>
                            <button className="text-cyan-500 mt-4 hover:underline">
                                قراءة المزيد
                            </button>
                        </div>
                    ))}
                </div>

                {/* النقاط السفلية */}
                <div className="flex justify-center mt-8 space-x-2">
                    <span className="w-3 h-3 bg-cyan-500 rounded-full"></span>
                    <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                    <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;