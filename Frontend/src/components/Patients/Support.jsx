import React from "react";
import PNavbar from "./PNavbar.jsx";

const Support = () => {
    return (
        <div dir={"rtl"} className="bg-white max-h-screen">
            {/* شريط التنقل */}
            <div className="font-sans">
                <PNavbar/>
            </div>

            <div className="bg-gray-100 min-h-screen p-8">
                <div className="container mx-auto">
                    {/* العنوان الرئيسي */}
                    <h2 className="text-cyan-700 text-2xl font-bold text-center mb-8">
                        الدعم النفسي
                    </h2>

                    {/* روابط مجموعات الدعم النفسي */}
                    <h3 className="text-lg font-bold text-center mb-6">
                        روابط مجموعات الدعم النفسي على مواقع التواصل الاجتماعي
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* بطاقة فيسبوك */}
                        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                                alt="Facebook"
                                className="w-12 h-12 mx-auto mb-4"
                            />
                            <p className="text-gray-700 font-bold mb-2">
                                مجموعة منتدى شباب غزة-الجنوب للدعم النفسي.
                            </p>
                            <a
                                href ="#"
                                className="text-cyan-700 font-bold hover:underline"
                            >
                                انضم الآن
                            </a>
                        </div>

                        {/* بطاقة واتساب */}
                        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
                            <img
                                src ="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                                alt="WhatsApp"
                                className="w-12 h-12 mx-auto mb-4"
                            />
                            <p className="text-gray-700 font-bold mb-2">
                                مجموعة منتدى شباب غزة-الجنوب للدعم النفسي.
                            </p>
                            <a
                                href="#"
                                className="text-cyan-700 font-bold hover:underline"
                            >
                                انضم الآن
                            </a>
                        </div>

                        {/* بطاقة إنستغرام */}
                        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
                            <img
                                src ="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                                alt="Instagram"
                                className="w-12 h-12 mx-auto mb-4"
                            />
                            <p className="text-gray-700 font-bold mb-2">
                                مجموعة منتدى شباب غزة-الجنوب للدعم النفسي.
                            </p>
                            <a
                                href ="#"
                                className="text-cyan-700 font-bold hover:underline"
                            >
                                انضم الآن
                            </a>
                        </div>

                        {/* بطاقة يوتيوب */}
                        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
                            <img
                                src ="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"
                                alt="YouTube"
                                className="w-12 h-12 mx-auto mb-4"
                            />
                            <p className="text-gray-700 font-bold mb-2">
                                مجموعة منتدى شباب غزة-الجنوب للدعم النفسي.
                            </p>
                            <a
                                href="#"
                                className="text-cyan-700 font-bold hover:underline"
                            >
                                انضم الآن
                            </a>
                        </div>
                    </div>

                    {/* تمارين التأمل والتنفس */}
                    <h3 className="text-lg font-bold text-right mt-12 mb-6">
                        تمارين التأمل والتنفس
                    </h3>
                    <div className="space-y-4">
                        {/* الرابط الأول */}
                        <div className="flex items-center bg-white shadow-lg rounded-lg p-4">
                            <img
                                src="src/assets/brath.jpeg"
                                alt="Lungs"
                                className="w-12 h-12 mr-4"
                            />
                            <a
                                href ="https://youtu.be/W_wx3v0sPec?si=dx6bz2WAuPYRbcJz"
                                className="text-cyan-700 font-bold hover:underline"
                            >
                                https://youtu.be/W_wx3v0sPec?si=dx6bz2WAuPYRbcJz
                            </a>
                        </div>

                        {/* الرابط الثاني */}
                        <div className="flex items-center bg-white shadow-lg rounded-lg p-4">
                            <img
                                src="src/assets/brath.jpeg"
                                alt="Meditation"
                                className="w-12 h-12 mr-4"
                            />
                            <a
                                href="https://youtu.be/1ZYbU82GVz4?si=2UKJveeg6HSrqmG"
                                className="text-cyan-700 font-bold hover:underline"
                            >
                                https://youtu.be/1ZYbU82GVz4?si=2UKJveeg6HSrqmG
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Support;