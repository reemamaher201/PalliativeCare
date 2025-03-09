import React, { useState, useEffect } from "react";
import axios from "axios";
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

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DashboardS = () => {
    const [providerData, setProviderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProviderData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("لم يتم العثور على التوكن. يرجى تسجيل الدخول.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get("http://127.0.0.1:8000/api/dashboardS", { // استبدل بنقطة النهاية الصحيحة
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setProviderData(response.data);
            } catch (err) {
                console.error("Error fetching provider dashboard data:", err);
                setError(err.response?.data?.message || "حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.");
            } finally {
                setLoading(false);
            }
        };

        fetchProviderData();
    }, []);

    if (loading) {
        return <div className="text-center mt-8">جاري تحميل البيانات...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-600">{error}</div>;
    }

    if (!providerData) {
        return <div className="text-center mt-8">لا توجد بيانات للوحة التحكم.</div>;
    }

    // بيانات الرسم البياني الدائري
    const pieData = {
        labels: ["الحالات النشطة", "إجمالي المستفيدين"],
        datasets: [
            {
                // data: [providerData.activeCases, providerData.totalBeneficiaries],
                backgroundColor: ["#36A2EB", "#FFCE56"],
                hoverBackgroundColor: ["#36A2EB", "#FFCE56"],
            },
        ],
    };

    // بيانات الرسم البياني العمودي
    const barData = {
        // labels: Object.keys(providerData.casesByRegion),
        datasets: [
            {
                label: "إسعافات",
                // data: Object.values(providerData.casesByRegion).map((region) => region.ambulance),
                backgroundColor: "#FF6384",
            },
            {
                label: "غذائية",
                // data: Object.values(providerData.casesByRegion).map((region) => region.food),
                backgroundColor: "#36A2EB",
            },
            {
                label: "طبية",
                // data: Object.values(providerData.casesByRegion).map((region) => region.medical),
                backgroundColor: "#FFCE56",
            },
        ],
    };

    return (
        <div dir="rtl" className="flex min-h-screen bg-gray-100">
            {/* الشريط الجانبي */}
            <aside className="w-1/4 bg-cyan-700 text-white p-6">
                <h2 className="text-xl font-bold mb-6">لوحة التحكم الرئيسية</h2>
                {providerData.name && <p>مرحباً، {providerData.name}!</p>}
                {providerData.email && <p>البريد الإلكتروني: {providerData.email}</p>}
                {providerData.phoneNumber && <p>رقم الهاتف: {providerData.phoneNumber}</p>}
                <ul className="space-y-4">
                    <li className="hover:underline cursor-pointer">إدارة الحالات</li>
                    <li className="hover:underline cursor-pointer">إدارة مخزون الأدوية</li>
                    <li className="hover:underline cursor-pointer">إعدادات الحساب</li>
                </ul>
            </aside>

            {/* المحتوى الرئيسي */}
            <main className="flex-1 p-6">
                {/* الشريط العلوي */}
                <header className="flex justify-between items-center mb-6 px-4 py-2 bg-white shadow-md">
                    {/* اسم الجمعية */}
                    <h1 className="text-xl font-bold">جمعية الصليب الأحمر الفلسطيني</h1>

                    {/* الأيقونات */}
                    <div className="flex items-center space-x-4 space-x-reverse">
                        {/* أيقونة تسجيل الخروج */}
                        <button className="text-blue-500 hover:text-blue-700">
                            <i className="fas fa-sign-out-alt text-xl"></i>
                        </button>
                        {/* أيقونة الإشعارات */}
                        <button className="relative text-blue-500 hover:text-blue-700">
                            <i className="fas fa-bell text-xl"></i>
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center"></span>
                        </button>
                        {/* أيقونة الرسائل */}
                        <button className="text-blue-500 hover:text-blue-700">
                            <i className="fas fa-comment-dots text-xl"></i>
                        </button>
                    </div>
                </header>

                {/*/!* الإحصائيات *!/*/}
                {/*<section>*/}
                {/*    /!* البطاقات العلوية *!/*/}
                {/*    /!*<div className="grid grid-cols-3 gap-4 mb-6">*!/*/}
                {/*    /!*    <div className="bg-white p-4 rounded-lg shadow-lg text-center">*!/*/}
                {/*    /!*        <p className="text-gray-500">معدل الاستجابة</p>*!/*/}
                {/*    /!*        <p className="text-cyan-700 font-bold text-xl">{providerData.responseRate}</p>*!/*/}
                {/*    /!*        <p className="text-gray-400 text-sm">الوقت اللازم للاستجابة لكل مريض</p>*!/*/}
                {/*    /!*    </div>*!/*/}
                {/*    /!*    <div className="bg-white p-4 rounded-lg shadow-lg text-center">*!/*/}
                {/*    /!*        <p className="text-gray-500">الحالات النشطة</p>*!/*/}
                {/*    /!*        <p className="text-cyan-700 font-bold text-xl">{providerData.activeCases}</p>*!/*/}
                {/*    /!*    </div>*!/*/}
                {/*    /!*    <div className="bg-white p-4 rounded-lg shadow-lg text-center">*!/*/}
                {/*    /!*        <p className="text-gray-500">إجمالي المستفيدين</p>*!/*/}
                {/*    /!*        <p className="text-cyan-700 font-bold text-xl">{providerData.totalBeneficiaries}</p>*!/*/}
                {/*    /!*    </div>*!/*/}
                {/*    /!*</div>*!/*/}

                {/*    /!* الرسم البياني الدائري *!/*/}
                {/*    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">*/}
                {/*        <Pie*/}
                {/*            data={pieData}*/}
                {/*            options={{*/}
                {/*                responsive: true,*/}
                {/*                maintainAspectRatio: false,*/}
                {/*            }}*/}
                {/*            width={400}*/}
                {/*            height={400}*/}
                {/*        />*/}
                {/*    </div>*/}

                {/*    /!* الرسم البياني العمودي *!/*/}
                {/*    <h3 className="text-lg font-bold text-cyan-700 mb-6">توزيع الحالات (الطبية، الغذائية، الإسعافات)</h3>*/}
                {/*    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">*/}
                {/*        <Bar data={barData} />*/}
                {/*    </div>*/}

                {/*    /!* البطاقات السفلية *!/*/}
                {/*    <div className="grid grid-cols-2 gap-4 mb-6">*/}
                {/*        <div className="bg-white p-4 rounded-lg shadow-lg text-center">*/}
                {/*            <p className="text-gray-500">الحالات الجديدة هذا الأسبوع</p>*/}
                {/*            <p className="text-cyan-700 font-bold text-xl">{providerData.newCasesThisWeek}</p>*/}
                {/*        </div>*/}
                {/*        <div className="bg-white p-4 rounded-lg shadow-lg text-center">*/}
                {/*            <p className="text-gray-500">الحالات الجديدة هذا الشهر</p>*/}
                {/*            <p className="text-cyan-700 font-bold text-xl">{providerData.newCasesThisMonth}</p>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</section>*/}

                {/* التنبيهات والإشعارات */}
                {/*<section>*/}
                {/*    <h3 className="text-lg font-bold text-cyan-700 mb-6">تنبيهات وإشعارات</h3>*/}
                {/*    <div className="space-y-4">*/}
                {/*        {providerData.notifications &&*/}
                {/*            providerData.notifications.map((notification, index) => (*/}
                {/*                <div*/}
                {/*                    key={index}*/}
                {/*                    className={`p-4 rounded-lg shadow-lg ${*/}
                {/*                        index % 2 === 0 ? "bg-red-100" : "bg-blue-100"*/}
                {/*                    }`}*/}
                {/*                >*/}
                {/*                    <p className="text-gray-700">{notification.message}</p>*/}
                {/*                </div>*/}
                {/*            ))}*/}
                {/*    </div>*/}
                {/*</section>*/}
            </main>
        </div>
    );
};

export default DashboardS;