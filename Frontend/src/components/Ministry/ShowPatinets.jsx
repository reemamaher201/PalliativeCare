import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "./comp/Sidebar.jsx";

const ShowPatients = () => {
    const [patients, setPatients] = useState([]);
    const [ministryName, setMinistryName] = useState("أحمد محمد"); // اسم عامل الوزارة
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterPatients();
    }, [patients, searchQuery]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/api/showpatient", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPatients(response.data);
        } catch (error) {
            if (error.response) {
                setError(`حدث خطأ: ${error.response.status} - ${error.response.data.message}`);
            } else if (error.request) {
                setError("لا يوجد استجابة من الخادم. يرجى التحقق من اتصال الشبكة.");
            } else {
                setError("حدث خطأ أثناء إعداد الطلب.");
            }
        } finally {
            setLoading(false);
        }
    };

    const filterPatients = () => {
        const filtered = patients.filter(
            (patient) =>
                patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                patient.nationalId.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPatients(filtered);
    };

    const handleDelete = (id) => {
        if (window.confirm("هل أنت متأكد أنك تريد حذف هذا المريض؟")) {
            // قم بتنفيذ عملية الحذف هنا (API call)
            console.log(`Deleting patient with id: ${id}`);
        }
    };

    if (loading) return <div className="text-center">جاري التحميل...</div>;

    if (error) return <div className="text-center text-red-500">حدث خطأ: {error}</div>;

    return (
        <div dir={"rtl"} className="flex min-h-screen bg-gray-100">
            {/* الشريط الجانبي */}
            <Sidebar/>

            {/* Main content */}
            <main className="flex-1 p-6">
                {/* Header */}
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">{ministryName}</h1>
                    <div className="flex space-x-4">
                        <i className="fas fa-bell text-gray-500 text-lg cursor-pointer"></i>
                        <i className="fas fa-envelope text-gray-500 text-lg cursor-pointer"></i>
                    </div>
                </header>

                {/* Search bar and add button */}
                <div className="flex justify-between items-center mb-6">
                    <div className="relative w-1/3">
                        <input
                            type="text"
                            placeholder="بحث"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className="absolute top-2 left-3 text-gray-400">
                            <i className="fas fa-search"></i>
                        </span>
                    </div>
                    <Link to="/addpatient" className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition">
                        إضافة مريض جديد
                    </Link>
                </div>

                {/* Patients table */}
                <section>
                    <h3 className="text-lg font-bold text-gray-700 mb-4">قائمة المرضى</h3>
                    <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-right">اسم المريض</th>
                            <th className="px-4 py-2 text-right">الرقم الوطني</th>
                            <th className="px-4 py-2 text-right">تاريخ الميلاد</th>
                            <th className="px-4 py-2 text-right">رقم الجوال</th>
                            <th className="px-4 py-2 text-right">تعديل</th>
                            <th className="px-4 py-2 text-right">حذف</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredPatients.map((patient) => (
                            <tr key={patient.id} className="border-b">
                                <td className="px-4 py-2 text-right">{patient.name}</td>
                                <td className="px-4 py-2 text-right">{patient.nationalId}</td>
                                <td className="px-4 py-2 text-right">{patient.dateOfBirth}</td>
                                <td className="px-4 py-2 text-right">{patient.phoneNumber}</td>
                                <td className="px-4 py-2 text-right">
                                    <Link to={`/editpatient/${patient.id}`} className="text-cyan-700">
                                        <i className="fas fa-edit"></i>
                                    </Link>
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <button onClick={() => handleDelete(patient.id)} className="text-red-500">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default ShowPatients;