import React from "react";

const BlogSection = ({ blogs }) => {
    return (
        <section className="py-12 px-8 bg-gray-50" dir="rtl">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-extrabold mb-8 text-gray-900">📖 نصائح ومدونات</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogs.map((blog, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-lg rounded-xl p-6 transition-transform transform hover:scale-105 hover:shadow-2xl"
                        >
                            <h3 className="text-xl font-bold text-cyan-700 mb-4">{blog.title}</h3>
                            <p className="text-gray-700 mb-4">{blog.content}</p>
                            {blog.link && (
                                <a
                                    href={blog.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-cyan-600 font-semibold mt-4 hover:underline"
                                >
                                    🔗 قراءة المزيد
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
