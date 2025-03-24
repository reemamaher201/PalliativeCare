import React from "react";
import { Info } from "lucide-react"; // استيراد أيقونة من مكتبة lucide-react

const AboutSection = ({ imgabout, main_heading, main_text }) => {
    return (
        <section className="py-16 px-8 bg-gray-50">
            <div className="shadow-lg rounded-xl container mx-auto flex flex-col md:flex-row items-center justify-between gap-12 px-6 py-8 bg-white">
                {/* صورة تعريفية */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <img
                        src={imgabout}
                        alt="عن الموقع"
                        className="rounded-lg shadow-md w-4/5 max-w-sm"
                    />
                </div>

                {/* نص حول الموقع */}
                <div className="w-full md:w-1/2 text-center md:text-right">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4 flex items-center justify-end gap-3">
                        {main_heading}
                        <Info className="text-cyan-600 w-8 h-8" /> {/* أيقونة عن الموقع */}
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg">{main_text}</p>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
