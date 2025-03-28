import React from "react";

const ServicesSection = ({ services }) => {
    return (
        <section className="py-12 px-8 bg-gray-50" dir="rtl">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-extrabold mb-8 text-gray-900">⚕️ خدماتنا الطبية</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-lg rounded-xl p-6 transition-transform transform hover:scale-105 hover:shadow-2xl"
                        >
                            <h3 className="text-xl font-bold text-cyan-700 mb-4 flex items-center justify-center gap-2">
                                {service.icon && <span className="text-3xl">{service.icon}</span>}
                                {service.title}
                            </h3>

                            <p className="text-gray-700 mb-4">{service.content}</p>

                            {service.image && (
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-60 object-cover mt-4 rounded-lg"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
