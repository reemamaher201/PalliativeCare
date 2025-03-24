import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const FeaturesSection = ({ features }) => {
    const [startIndex, setStartIndex] = useState(0);
    const itemsPerPage = 3;

    const handleNext = () => {
        if (startIndex + itemsPerPage < features.length) {
            setStartIndex(startIndex + itemsPerPage);
        }
    };

    const handlePrev = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - itemsPerPage);
        }
    };

    const displayedFeatures = features.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(features.length / itemsPerPage);
    const currentPage = Math.floor(startIndex / itemsPerPage) + 1;

    return (
        <section className="py-12 px-4 sm:px-8 bg-gray-50 relative" dir="rtl">
            <div className="container mx-auto text-center relative">
                <h2 className="text-3xl font-extrabold mb-8 text-gray-900">⭐ مزايا التسجيل</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 mb-8">
                    {displayedFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-lg rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                        >
                            <h3 className="text-xl font-bold text-cyan-700 mb-4">
                                {feature.title}
                            </h3>
                            <p className="text-gray-700">{feature.content}</p>
                        </div>
                    ))}
                </div>

                {features.length > itemsPerPage && (
                    <>
                        <div className="flex justify-between w-full absolute top-1/2 left-0 right-0 -translate-y-1/2 px-2 sm:px-4">
                            <button
                                onClick={handlePrev}
                                disabled={startIndex === 0}
                                className={`bg-cyan-500 text-white p-2 rounded-full shadow-md hover:bg-cyan-600 transition-colors ${
                                    startIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                                }`}
                            >
                                <FaChevronRight size={18} />
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={startIndex + itemsPerPage >= features.length}
                                className={`bg-cyan-500 text-white p-2 rounded-full shadow-md hover:bg-cyan-600 transition-colors ${
                                    startIndex + itemsPerPage >= features.length ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                                }`}
                            >
                                <FaChevronLeft size={18} />
                            </button>
                        </div>

                        {/* نقاط التمرير */}
                        <div className="flex justify-center mt-6 space-x-2">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setStartIndex(index * itemsPerPage)}
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                        currentPage === index + 1 ? 'bg-cyan-500' : 'bg-gray-300'
                                    }`}
                                    aria-label={`انتقل إلى الشريحة ${index + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default FeaturesSection;