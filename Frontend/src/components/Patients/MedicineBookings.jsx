import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Navbar from "./pNavbar.jsx";
import errorGif from '../../assets/Mobile Login.gif';
import ChatButton from "../Utilties/ChatButton.jsx";
import { PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const MedicineBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            setError("");
            setSuccessMessage("");

            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError(
                        <div className="flex flex-col items-center justify-center">
                            <img src={errorGif} alt="Error" className="h-100 w-100 mb-8" />
                            <p className="text-red-600 font-semibold mb-4">لم يتم العثور على المستخدم. يرجى تسجيل الدخول.</p>
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-cyan-700 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded"
                            >
                                تسجيل الدخول
                            </button>
                        </div>
                    );
                    setLoading(false);
                    return;
                }

                const response = await axios.get("http://127.0.0.1:8000/api/medicine-bookings", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setBookings(response.data.data || []);

                // Check for success message in URL (for redirects after booking)
                const urlParams = new URLSearchParams(window.location.search);
                const message = urlParams.get('success');
                if (message) {
                    setSuccessMessage(message);
                    // Clear the URL parameter
                    window.history.replaceState({}, document.title, window.location.pathname);
                }

            } catch (err) {
                console.error("Error fetching bookings:", err);
                setError(err.response?.data?.message || "حدث خطأ أثناء جلب طلبات الأدوية. يرجى المحاولة مرة أخرى.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const getStatusBadge = (status) => {
        const statusClasses = {
            pending: "bg-yellow-100 text-yellow-800",
            approved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800"
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
                {status === 'pending' && 'قيد الانتظار'}
                {status === 'approved' && 'تم الموافقة'}
                {status === 'rejected' && 'تم الرفض'}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                <p className="mt-4 text-lg font-semibold text-cyan-500">جاري تحميل البيانات...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-center mt-8 text-red-600">{error}</div>;
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="font-sans">
                <Navbar />
            </div>

            <div dir={"rtl"} className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-cyan-700">طلبات الأدوية الخاصة بي</h1>
                </div>

                {successMessage && (
                    <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
                        <p>{successMessage}</p>
                    </div>
                )}

                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    {bookings.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الدواء</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الكمية</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الطلب</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ملاحظات</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {bookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{booking.medicine?.name}</div>
                                            <div className="text-sm text-gray-500">{booking.medicine?.type}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {booking.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(booking.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(booking.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {booking.notes || 'لا يوجد'}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">لا توجد طلبات أدوية مسجلة</h3>
                            <p className="mt-1 text-sm text-gray-500">يمكنك حجز الأدوية من صفحة الأدوية المتاحة</p>
                            <div className="mt-6">
                                <button
                                    onClick={() => navigate("/medicines")}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                >
                                    عرض الأدوية المتاحة
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ChatButton />
        </div>
    );
};

export default MedicineBookings;