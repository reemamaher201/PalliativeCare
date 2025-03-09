import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from "chart.js";
import Header from "./comp/Header.jsx";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const StatisticsPage = () => {
    // بيانات الرسم البياني الدائري
    const pieData = {
        labels: [
            "عدد المرضى الذين تلقوا العناية",
            "عدد الحالات الطارئة التي تم التعامل معها",
            "المستفيدين من الدعم النفسي",
            "المستفيدين من التغذية العلاجية",
        ],
        datasets: [
            {
                data: [60, 40, 30, 20],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
                hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
            },
        ],
    };

    // بيانات الرسم البياني العمودي
    const barData = {
        labels: ["شمال غزة", "غرب غزة", "شرق غزة", "دير البلح", "خانيونس", "رفح"],
        datasets: [
            {
                label: "عدد المناطق المستهدفة",
                data: [20, 40, 60, 80, 50, 30],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
            },
        ],
    };

    return (
        <div dir="rtl" className="flex min-h-screen bg-gray-100">
            {/* الشريط الجانبي */}
            <aside className="w-1/4 bg-cyan-700 text-white p-6">
                <h2 className="text-xl font-bold mb-6">لوحة التحكم الرئيسية</h2>
                <ul className="space-y-4">
                    <li className="hover:underline cursor-pointer">المرضى</li>
                    <li className="hover:underline cursor-pointer">الأدوية</li>
                    <li className="hover:underline cursor-pointer">إحصائيات</li>
                    <li className="hover:underline cursor-pointer">مزود الخدمة</li>
                    <li className="hover:underline cursor-pointer">الإشعارات</li>
                </ul>
            </aside>

            {/* المحتوى الرئيسي */}
            <main className="flex-1 ">
                {/* الشريط العلوي */}
               <Header/>

                {/* الإحصائيات */}
                <section className="m-8">
                    <h3 className="text-lg font-bold text-cyan-700 mb-6">إحصائيات المرضى والمستفيدين</h3>
                    <div className="bg-blue-100  rounded-lg shadow-lg mb-6 p-6">
                        <Pie
                            data={pieData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                            }}
                            width={400}
                            height={400}
                        />
                    </div>

                    {/* بطاقات الإحصائيات */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                            <p className="text-gray-500">عدد الاستشارات العلاجية</p>
                            <p className="text-cyan-700 font-bold text-xl">4000 استشارة</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                            <p className="text-gray-500">عدد الجلسات العلاجية</p>
                            <p className="text-cyan-700 font-bold text-xl">8000 جلسة</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                            <p className="text-gray-500">عدد جلسات الدعم النفسي</p>
                            <p className="text-cyan-700 font-bold text-xl">6000 جلسة</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                            <p className="text-gray-500">متوسط الخدمة لكل مريض</p>
                            <p className="text-cyan-700 font-bold text-xl">24 ساعة</p>
                        </div>
                    </div>

                    {/* الموارد البشرية والبنية التحتية */}
                    <h3 className="text-lg font-bold text-cyan-700 mb-6">الموارد البشرية والبنية التحتية</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                            <p className="text-gray-500">عدد الأطباء والممرضين</p>
                            <p className="text-cyan-700 font-bold text-xl">35000 طبيب وطبيبة</p>
                            <p className="text-cyan-700 font-bold text-xl">8000 ممرض وممرضة</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                            <p className="text-gray-500">عدد المرافق المجهزة</p>
                            <p className="text-cyan-700 font-bold text-xl">12000 مرفق</p>
                            <p className="text-red-500 font-bold text-sm">غير كافٍ</p>
                        </div>
                    </div>

                    {/* الرسم البياني العمودي */}
                    <h3 className="text-lg font-bold text-cyan-700 mb-6">التحديات والاستجابات</h3>
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                        <Bar data={barData} width={400}
                              />
                    </div>

                    {/* بطاقات إضافية */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                            <p className="text-gray-500">عدد مشاريع التعاون المشترك</p>
                            <p className="text-cyan-700 font-bold text-xl">30000 مشروع</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                            <p className="text-gray-500">عدد المنظمات المحلية والدولية</p>
                            <p className="text-cyan-700 font-bold text-xl">18 منظمة محلية</p>
                            <p className="text-cyan-700 font-bold text-xl">24 منظمة دولية</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default StatisticsPage;