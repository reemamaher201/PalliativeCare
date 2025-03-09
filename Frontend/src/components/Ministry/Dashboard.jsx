import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import Sidebar from "./comp/Sidebar.jsx";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DashboardM = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("لم يتم العثور على التوكن. يرجى تسجيل الدخول.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get("http://127.0.0.1:8000/api/dashboardM", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUserData(response.data);
            } catch (err) {
                console.error("Error fetching ministry dashboard data:", err);
                setError(err.response?.data?.message || "حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div className="text-center mt-8">جاري تحميل البيانات...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-600">{error}</div>;
    }

    if (!userData) {
        return <div className="text-center mt-8">لا توجد بيانات للوحة التحكم.</div>;
    }

    const pieData = {
        labels: ["الحالات النشطة", "إجمالي المستفيدين"],
        datasets: [
            {
                data: [userData.activeCases, userData.totalBeneficiaries],
                backgroundColor: ["#36A2EB", "#FFCE56"],
                hoverBackgroundColor: ["#36A2EB", "#FFCE56"],
            },
        ],
    };

    const barData = {
        labels: userData?.casesByRegion ? Object.keys(userData.casesByRegion) : [],
        datasets: userData?.casesByRegion
            ? [
                {
                    label: "إسعافات",
                    data: Object.values(userData.casesByRegion).map(region => region.ambulance || 0),
                    backgroundColor: "#FF6384",
                },
                {
                    label: "غذائية",
                    data: Object.values(userData.casesByRegion).map(region => region.food || 0),
                    backgroundColor: "#36A2EB",
                },
                {
                    label: "طبية",
                    data: Object.values(userData.casesByRegion).map(region => region.medical || 0),
                    backgroundColor: "#FFCE56",
                },
            ]
            : [],
    };


    return (
        <div dir={"rtl"} className="flex min-h-screen bg-gray-100">
            {/* الشريط الجانبي */}
           <Sidebar/>

            {/* المحتوى الرئيسي */}
            <main className="flex-1 p-6">
                {/* الشريط العلوي */}
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">{userData.min || "اسم المستخدم"}</h1>
                    <div className="flex space-x-4 space-x-reverse">
                        <i className="fas fa-bell text-gray-500 text-lg cursor-pointer"></i>
                        <i className="fas fa-envelope text-gray-500 text-lg cursor-pointer"></i>
                    </div>
                </header>


                {/* الإحصائيات */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-gray-700 font-bold mb-4">عدد المرضى المسجلين</h3>
                        <p className="text-3xl font-bold text-cyan-700">{userData.registeredPatientsCount || "0"}</p>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-gray-700 font-bold mb-4">نسبة المرضى لكل قسم</h3>
                        <div className="w-64 h-64 mx-auto">
                            <Pie data={pieData} />
                        </div>
                    </div>
                </section>

                {/* جدول الأدوية المتوفرة */}
                <section className="mb-6">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">الأدوية المتوفرة حاليا</h3>
                    <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-right">الدواء</th>
                            <th className="px-4 py-2 text-right">الكمية</th>
                            <th className="px-4 py-2 text-right">المناطق المتوفرة</th>
                            <th className="px-4 py-2 text-right">تعديل</th>
                            <th className="px-4 py-2 text-right">حذف</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userData.availableMedicines && userData.availableMedicines.map(medicine => (
                            <tr key={medicine.id} className="border-b">
                                <td className="px-4 py-2 text-right">{medicine.name}</td>
                                <td className="px-4 py-2 text-right">{medicine.quantity}</td>
                                <td className="px-4 py-2 text-right">{medicine.availableAreas.join(", ")}</td>
                                <td className="px-4 py-2 text-right">
                                    <i className="fas fa-edit text-cyan-700 cursor-pointer"></i>
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <i className="fas fa-trash text-red-500 cursor-pointer"></i>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

                {/* جدول الحالات الطارئة */}
                <section>
                    <h3 className="text-lg font-bold text-gray-700 mb-4">الحالات الطارئة</h3>
                    <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-right">المريض</th>
                            <th className="px-4 py-2 text-right">المرض</th>
                            <th className="px-4 py-2 text-right">نوع الحالة</th>
                            <th className="px-4 py-2 text-right">حالة الطلب</th>
                            <th className="px-4 py-2 text-right">منطقة السكن</th>
                            <th className="px-4 py-2 text-right">حذف</th>
                        </tr>
                        </thead>        <tbody>
                    {userData.emergencyCases && userData.emergencyCases.map(caseItem => (
                        <tr key={caseItem.id} className="border-b">
                            <td className="px-4 py-2 text-right">{caseItem.patientName}</td>
                            <td className="px-4 py-2 text-right">{caseItem.disease}</td>
                            <td className="px-4 py-2 text-right">{caseItem.caseType}</td>
                            <td className="px-4 py-2 text-right">{caseItem.requestStatus}</td>
                            <td className="px-4 py-2 text-right">{caseItem.residenceArea}</td>
                            <td className="px-4 py-2 text-right">
                                <i className="fas fa-trash text-red-500 cursor-pointer"></i>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                </section>

                {/* الرسم البياني العمودي للحالات حسب المنطقة */}
                <section className="mt-8">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">الحالات حسب المنطقة</h3>
                    <div className="w-full h-96">
                        <Bar data={barData} />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DashboardM;