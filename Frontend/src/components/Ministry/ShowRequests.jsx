import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./comp/Sidebar.jsx";
import Header from "./comp/Header.jsx";
import ChatButton from "../Utilties/ChatButton.jsx";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const ShowRequests = () => {
    const [requests, setRequests] = useState([]);
    const [medRequests, setMedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("token");
            const patientResponse = await axios.get("http://127.0.0.1:8000/api/patients/pending", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(patientResponse.data);

            const medResponse = await axios.get("http://127.0.0.1:8000/api/med/pending", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMedRequests(medResponse.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
            setError("حدث خطأ أثناء جلب الطلبات.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
                <p className="mt-4 text-lg font-semibold text-cyan-500">جاري تحميل الطلبات...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-red-600 text-lg font-semibold">{error}</p>
            </div>
        );
    }

    return (
        <div dir="rtl" className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1">
                <Header />
                <div className="flex justify-between items-center mb-6 px-8 pt-6">
                    <button
                        onClick={() => navigate("/patients/pending")}
                        className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition"
                    >
                        عرض كل الطلبات
                    </button>
                </div>
                <div className="px-8">
                    <Tabs>
                        <TabList className="flex space-x-4 mb-6 border-b border-gray-200">
                            <Tab className="px-4 py-2 cursor-pointer text-gray-500 hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                 selectedClassName="text-cyan-700 border-b-2 border-cyan-500">
                                طلبات المرضى
                            </Tab>
                            <Tab className="px-4 py-2 cursor-pointer text-gray-500 hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                 selectedClassName="text-cyan-700 border-b-2 border-cyan-500">
                                طلبات الأدوية
                            </Tab>
                        </TabList>
                        <TabPanel>
                            <h3 className="text-lg font-bold text-gray-700 mb-4">طلبات المرضى</h3>
                            <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
                                <thead>
                                <tr className="bg-cyan-500 text-white">
                                    <th className="px-4 py-2 text-right">رقم الهوية</th>
                                    <th className="px-4 py-2 text-right">تاريخ الإرسال</th>
                                    <th className="px-4 py-2 text-right">المرسل</th>
                                    <th className="px-4 py-2 text-right">عرض التفاصيل</th>
                                </tr>
                                </thead>
                                <tbody>
                                {requests.map((request) => (
                                    <tr key={request.id} className="border-b hover:bg-gray-100">
                                        <td className="px-4 py-2 text-right">{request.identity_number}</td>
                                        <td className="px-4 py-2 text-right">{new Date(request.created_at).toLocaleString()}</td>
                                        <td className="px-4 py-2 text-right">{request.provider?.name || "غير معروف"}</td>
                                        <td className="px-4 py-2 text-right">
                                            <button
                                                onClick={() => navigate(`/patient-requests/${request.id}`)}
                                                className="text-cyan-700 hover:text-cyan-900"
                                            >
                                                عرض التفاصيل
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </TabPanel>
                        <TabPanel>
                            <h3 className="text-lg font-bold text-gray-700 mb-4">طلبات الأدوية</h3>
                            <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
                                <thead>
                                <tr className="bg-cyan-500 text-white">
                                    <th className="px-4 py-2 text-right">اسم الدواء</th>
                                    <th className="px-4 py-2 text-right">الكمية</th>
                                    <th className="px-4 py-2 text-right">تاريخ التسليم</th>
                                    <th className="px-4 py-2 text-right">عرض التفاصيل</th>
                                </tr>
                                </thead>
                                <tbody>
                                {medRequests.map((medRequest) => (
                                    <tr key={medRequest.id} className="border-b hover:bg-gray-100">
                                        <td className="px-4 py-2 text-right">{medRequest.name}</td>
                                        <td className="px-4 py-2 text-right">{medRequest.quantity}</td>
                                        <td className="px-4 py-2 text-right">{new Date(medRequest.delivery_date).toLocaleString()}</td>
                                        <td className="px-4 py-2 text-right">
                                            <button
                                                onClick={() => navigate(`/med-requests/${medRequest.id}`)}
                                                className="text-cyan-700 hover:text-cyan-900"
                                            >
                                                عرض التفاصيل
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </TabPanel>
                    </Tabs>
                </div>
            </main>
            <ChatButton />
        </div>
    );
};

export default ShowRequests;
