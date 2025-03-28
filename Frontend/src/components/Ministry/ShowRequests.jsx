import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./comp/Sidebar.jsx";
import Header from "./comp/Header.jsx";
import ChatButton from "../Utilties/ChatButton.jsx";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ChevronDownIcon,
    ChevronUpIcon, ListBulletIcon
} from "@heroicons/react/24/outline";
import {FilterIcon, SearchIcon} from "lucide-react";

const ShowRequests = () => {
    const [requests, setRequests] = useState([]);
    const [medRequests, setMedRequests] = useState([]);
    const [medicineBookings, setMedicineBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        status: "all",
        sort: "newest"
    });
    const [expandedFilters, setExpandedFilters] = useState(false);
    const navigate = useNavigate();

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("token");

            // جلب طلبات المرضى
            const patientResponse = await axios.get("http://127.0.0.1:8000/api/patients/pending", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(patientResponse.data);

            // جلب طلبات الأدوية
            const medResponse = await axios.get("http://127.0.0.1:8000/api/med/pending", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMedRequests(medResponse.data);

            // جلب طلبات حجز الأدوية من المرضى
            const bookingsResponse = await axios.get("http://127.0.0.1:8000/api/medicine-bookings", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Make sure the data is an array
            const bookingsData = Array.isArray(bookingsResponse.data)
                ? bookingsResponse.data
                : bookingsResponse.data.data || [];

            setMedicineBookings(bookingsData);

        } catch (error) {
            console.error("Error fetching requests:", error);
            setError("حدث خطأ أثناء جلب الطلبات.");
            setMedicineBookings([]); // Reset to empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleBookingStatusChange = async (id, status) => {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(
                `http://127.0.0.1:8000/api/medicine-bookings/${id}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchRequests();
        } catch (error) {
            console.error("Error updating booking status:", error);
            setError("حدث خطأ أثناء تحديث حالة الحجز.");
        }
    };

    const statusBadge = (status) => {
        const classes = {
            pending: "bg-yellow-100 text-yellow-800",
            approved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800"
        };

        const icons = {
            pending: <ClockIcon className="h-4 w-4" />,
            approved: <CheckCircleIcon className="h-4 w-4" />,
            rejected: <XCircleIcon className="h-4 w-4" />
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes[status]}`}>
                {icons[status]}
                <span className="ml-1">
                    {status === "pending" ? "قيد الانتظار" :
                        status === "approved" ? "تم الموافقة" : "مرفوض"}
                </span>
            </span>
        );
    };

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 10000);
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
                <button
                    onClick={fetchRequests}
                    className="mt-4 bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600"
                >
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    return (
        <div dir="rtl" className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1">
                <Header />
                <div className="px-8 py-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">إدارة طلبات الوزارة</h1>

                        <div className="flex space-x-4">
                            <button
                                onClick={() => navigate('/patients/pending')}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <ListBulletIcon className="h-5 w-5 mr-1" />
                                عرض جميع الطلبات
                            </button>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-2 border-gray-300 rounded-md"
                                    placeholder="بحث..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={() => setExpandedFilters(!expandedFilters)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FilterIcon className="h-4 w-4 mr-1" />
                                تصفية
                                {expandedFilters ? (
                                    <ChevronUpIcon className="h-4 w-4 ml-1" />
                                ) : (
                                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                                )}
                            </button>
                        </div>
                    </div>

                    {expandedFilters && (
                        <div className="bg-white p-4 rounded-lg shadow mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">حالة الطلب</label>
                                    <select
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                        value={filters.status}
                                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                                    >
                                        <option value="all">الكل</option>
                                        <option value="pending">قيد الانتظار</option>
                                        <option value="approved">تم الموافقة</option>
                                        <option value="rejected">مرفوض</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ترتيب حسب</label>
                                    <select
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                        value={filters.sort}
                                        onChange={(e) => setFilters({...filters, sort: e.target.value})}
                                    >
                                        <option value="newest">الأحدث أولاً</option>
                                        <option value="oldest">الأقدم أولاً</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

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
                            <Tab className="px-4 py-2 cursor-pointer text-gray-500 hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                 selectedClassName="text-cyan-700 border-b-2 border-cyan-500">
                                حجوزات الأدوية
                            </Tab>
                        </TabList>

                        <TabPanel>
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-cyan-500 text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">رقم الهوية</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">الاسم</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">تاريخ الطلب</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">الحالة</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">الإجراءات</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {requests.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {request.identity_number}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {request.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(request.created_at).toLocaleDateString('ar-EG')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {statusBadge(request.status || 'pending')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => navigate(`/patient-requests/${request.id}`)}
                                                    className="text-cyan-600 hover:text-cyan-900 mr-2"
                                                >
                                                    عرض التفاصيل
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>

                        <TabPanel>
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-cyan-500 text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">اسم الدواء</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">الكمية</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">تاريخ التسليم</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">الحالة</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">الإجراءات</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {medRequests.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {request.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {request.quantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(request.delivery_date).toLocaleDateString('ar-EG')}
                                                {new Date(request.delivery_date).toLocaleDateString('ar-EG')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {statusBadge(request.status || 'pending')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => navigate(`/med-requests/${request.id}`)}
                                                    className="text-cyan-600 hover:text-cyan-900 mr-2"
                                                >
                                                    عرض التفاصيل
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>

                        <TabPanel>
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-cyan-500 text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">المريض</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">الدواء</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">الكمية</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">تاريخ الطلب</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">الحالة</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">الإجراءات</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {medicineBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{booking.user?.name}</div>
                                                <div className="text-sm text-gray-500">{booking.user?.identity_number}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {booking.medicine?.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {booking.quantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(booking.created_at).toLocaleDateString('ar-EG')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {statusBadge(booking.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {booking.status === 'pending' && (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleBookingStatusChange(booking.id, 'approved')}
                                                            className="text-green-600 hover:text-green-900"
                                                            title="موافقة"
                                                        >
                                                            <CheckCircleIcon className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleBookingStatusChange(booking.id, 'rejected')}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="رفض"
                                                        >
                                                            <XCircleIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => navigate(`/booking-details/${booking.id}`)}
                                                    className="text-cyan-600 hover:text-cyan-900"
                                                >
                                                    التفاصيل
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>
                    </Tabs>
                </div>
            </main>
            <ChatButton />
        </div>
    );
};

export default ShowRequests;