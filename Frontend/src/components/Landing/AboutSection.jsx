import React from "react";

const AboutSection = ({imgabout, main_heading, main_text }) => {
    return (
        <section className="py-16 px-8">
            <div className="shadow rounded-lg container mx-auto flex flex-col md:flex-row items-center justify-between gap-8 px-4">
                <div className="w-full md:w-1/2 flex justify-center">
                    <img
                        src={`http://localhost:8000${imgabout}`}
                        alt="عن الموقع"
                        className="rounded-lg shadow-md"
                    />
                </div>
                <div className="w-full md:w-1/2 text-center md:text-right">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">{main_heading}</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {main_text}
                    </p>
                </div>

            </div>
        </section>
    );
};

export default AboutSection;