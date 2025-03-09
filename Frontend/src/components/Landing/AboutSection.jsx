import React from "react";

const AboutSection = () => {
    return (
        <section  className=" py-16 px-8 ">
            <div className="  shadow rounded-lg container mx-auto flex flex-col md:flex-row items-center justify-between gap-8 px-4">
                {/* الصورة */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <img src="/src/assets/logoo.png" // استبدل هذا الرابط برابط الصورة الفعلي
                        alt="عن الموقع"
                        className="rounded-lg shadow-md"
                    />
                </div>

                {/* النص */}
                <div className="w-full md:w-1/2 text-center md:text-right">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">عن الموقع</h2>
                    <p className="text-gray-700 leading-relaxed">
                        منصة مخصصة لدعم المرضى وأسرهم في مواجهة التحديات الصحية المزمنة أو الحرجة، خاصة في ظل ظروف الحرب. يهدف الموقع إلى تقديم معلومات شاملة حول الرعاية التلطيفية، وتوفير موارد نفسية وطبية وإرشاد المستفيدين إلى سبل التعامل مع الألم وتحسين جودة الحياة مع التركيز على الإنسانية والاحترام في أوقات الحاجة.
                    </p>
                </div>
            </div>
        </section  >);
};

export default AboutSection;