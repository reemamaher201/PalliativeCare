import React from "react";

const FeaturesSection = ({ features }) => {
    return (
        <section className="py-12 px-8" dir="rtl">
            <div className="container mx-auto text-center">
                <h2 className="text-2xl font-bold mb-8 text-gray-800">مزايا التسجيل</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="text-lg font-bold text-cyan-700 mb-4">{feature.title}</h3>
                            <p className="text-gray-700">{feature.content}</p>
                            {feature.image && (
                                <img src={feature.image} alt={feature.title} className="w-full h-32 object-cover mt-4" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;