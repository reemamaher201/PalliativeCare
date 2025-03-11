import React from "react";

const BlogSection = ({ blogs }) => {
    return (
        <section className="py-12 px-8" dir="rtl">
            <div className="container mx-auto text-center">
                <h2 className="text-2xl font-bold mb-8 text-gray-800">نصائح ومدونات</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogs.map((blog, index) => (
                        <div key={index} className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="text-lg font-bold text-cyan-700 mb-4">{blog.title}</h3>
                            <p className="text-gray-700">{blog.content}</p>
                            {blog.image && (
                                <img src={blog.image} alt={blog.title} className="w-full h-32 object-cover mt-4" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogSection;