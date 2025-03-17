import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import Sidebar from "./comp/Sidebar.jsx";
import errorGif from "../../assets/Mobile login.gif";
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DashboardM = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError("");
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
                if (err.response && err.response.data && err.response.data.error) {
                    setError(err.response.data.error); // عرض رسالة الخطأ من الخادم
                } else {
                    setError("حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                <p className="mt-4 text-lg font-semibold text-cyan-500">جاري تحميل البيانات...</p>
            </div>
        );
    }

    if (error) {
        if (error === "Unauthorized: User type \"0\" does not match required type \"PATIENT\"") {
            // عرض رسالة خطأ مخصصة لمستخدمي الوزارة
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-indigo-100 to-purple-100">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938-1a9 9 0 1 1 13.876 0A9 9 0 0 1 5.062 8.999z" />
                        </svg>
                        <p className="text-xl font-semibold text-gray-700 mb-4">عذراً، هذه الصفحة مخصصة للمرضى فقط.</p>
                        <p className="text-gray-600 mb-4">لا يمكنك الوصول إلى هذه الصفحة لأنك مستخدم وزارة.</p>
                        <a href="/dashboardM" className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded">العودة إلى لوحة تحكم الوزارة</a>
                    </div>
                </div>
            );
        } else {
            // عرض رسالة خطأ عامة
            return (
                <div className="flex flex-col items-center justify-center">
                    <img src={errorGif} alt="Error" className="h-100 w-100 mb-8" />
                    <p className="text-red-600 font-semibold mb-4">{error}</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-cyan-700 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded"
                    >
                        تسجيل الدخول
                    </button>
                </div>
            );
        }
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
            <Sidebar />
            <main className="flex-1 p-6">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">{userData.min || "اسم المستخدم"}</h1>
                    <div className="flex space-x-4 space-x-reverse">
                        <i className="fas fa-bell text-gray-500 text-lg cursor-pointer"></i>
                        <i className="fas fa-envelope text-gray-500 text-lg cursor-pointer"></i>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-gray-700 font-bold mb-4">عدد المرضى المسجلين</h3>
                        <p className="text-3xl font-bold text-cyan-700">{userData.registeredPatientsCount?.toLocaleString() || "0"}</p>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-gray-700 font-bold mb-4">نسبة المرضى لكل قسم</h3>
                        <div className="w-64 h-64 mx-auto">
                            <Pie data={pieData} />
                        </div>
                    </div>
                </section>

                <section className="mb-6">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">الأدوية المتوفرة حاليا</h3>
                    <div className="overflow-x-auto"> {/* إضافة شريط تمرير أفقي للجداول الكبيرة */}
                        <table className="min-w-full border-collapse bg-white shadow-lg rounded-lg">
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
                                <tr key={medicine.id} className="border-b hover:bg-gray-50"> {/* إضافة تأثير التمرير */}
                                    <td className="px-4 py-2 text-right">{medicine.name}</td>
                                    <td className="px-4 py-2 text-right">{medicine.quantity}</td>
                                    <td className="px-4 py-2 text-right">{medicine.availableAreas.join(", ")}</td>
                                    <td className="px-4 py-2 text-right">
                                        <button className="text-cyan-700 hover:text-cyan-900"> {/* تحويل الأيقونة إلى زر */}
                                            <i className="fas fa-edit"></i>
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <button className="text-red-500 hover:text-red-700"> {/* تحويل الأيقونة إلى زر */}
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h3 className="text-lg font-bold text-gray-700 mb-4">الحالات الطارئة</h3>
                    <div className="overflow-x-auto"> {/* إضافة شريط تمرير أفقي للجداول الكبيرة */}
                        <table className="min-w-full border-collapse bg-white shadow-lg rounded-lg">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 text-right">المريض</th>
                                <th className="px-4 py-2 text-right">المرض</th>
                                <th className="px-4 py-2 text-right">نوع الحالة</th>
                                <th className="px-4 py-2 text-right">حالة الطلب</th>
                                <th className="px-4 py-2 text-right">منطقة السكن</th>
                                <th className="px-4 py-2 text-right">حذف</th>
                            </tr>
                            </thead>
                            <tbody>
                            {userData.emergencyCases && userData.emergencyCases.map(caseItem => (
                                <tr key={caseItem.id} className="border-b hover:bg-gray-50"> {/* إضافة تأثير التمرير */}
                                    <td className="px-4 py-2 text-right">{caseItem.patientName}</td>
                                    <td className="px-4 py-2 text-right">{caseItem.disease}</td>
                                    <td className="px-4 py-2 text-right">{caseItem.caseType}</td>
                                    <td className="px-4 py-2 text-right">{caseItem.requestStatus}</td>
                                    <td className="px-4 py-2 text-right">{caseItem.residenceArea}</td>
                                    <td className="px-4 py-2 text-right">
                                        <button className="text-red-500 hover:text-red-700"> {/* تحويل الأيقونة إلى زر */}
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>

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