import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "./comp/Sidebar.jsx";

const ShowMedicines = () => {
    const [medicines, setMedicines] = useState([]);

    useEffect(() => {
        fetchMedicines();
    }, []);
    const fetchMedicines = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get("http://localhost:8000/api/showmedicines",{
                headers: { Authorization: `Bearer ${token}` },
            });
            setMedicines(response.data.medicines);        } catch (error) {
            console.error("There was an error fetching the medicines!", error);
        }
    };
    return (
        <div dir={"rtl"} className="flex min-h-screen bg-gray-100">
            {/* الشريط الجانبي */}
            <Sidebar/>

            <main className="flex-1 p-6">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">أحمد محمد</h1>
                    <div className="flex space-x-4">
                        <i className="fas fa-bell text-gray-500 text-lg cursor-pointer"></i>
                        <i className="fas fa-envelope text-gray-500 text-lg cursor-pointer"></i>
                    </div>
                </header>

                <div className="flex justify-between items-center mb-6">
                    <div className="relative w-1/3">
                        <input

                            type="text"
                            placeholder="بحث"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <span  className="absolute top-2 left-3 text-gray-400">
                            <i className="fas fa-search"></i>
                        </span>
                    </div>
                    <button>
                        <Link
                            to="/addmedicien"
                            className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition"
                        >
                            إضافة دواء جديد
                        </Link>
                    </button>
                </div>

                <section>
                    <h3 className="text-lg font-bold text-gray-700 mb-4">الأدوية</h3>
                    <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
                        <thead>
                        <tr className="bg-cyan-500 text-white">
                            <th className="px-4 py-2 text-right">الدواء</th>
                            <th className="px-4 py-2 text-right">الوصف</th>
                            <th className="px-4 py-2 text-right">الكمية الموزعة</th>
                            <th className="px-4 py-2 text-right">الكمية المطلوبة</th>
                            <th className="px-4 py-2 text-right">أماكن التواجد</th>
                            <th className="px-4 py-2 text-right">تاريخ التوزيع القادم</th>
                            <th className="px-4 py-2 text-right">تعديل</th>
                            <th className="px-4 py-2 text-right">حذف</th>
                        </tr>
                        </thead>
                        <tbody>
                        {medicines.map((medicine) => (
                            <tr key={medicine.id} className="border-b transition-colors duration-200 hover:bg-gray-100">
                                <td className="px-4 py-2 text-right">{medicine.name}</td>
                                <td className="px-4 py-2 text-right">{medicine.description}</td>
                                <td className="px-4 py-2 text-right">{medicine.distributed_quantity}</td>
                                <td className="px-4 py-2 text-right">{medicine.required_quantity}</td>
                                <td className="px-4 py-2 text-right">{medicine.locations}</td>
                                <td className="px-4 py-2 text-right">{medicine.next_distribution_date}</td>
                                <td className="px-4 py-2 text-right">
                                    <i className="fas fa-edit text-cyan-700 cursor-pointer hover:text-cyan-900 transition-colors duration-200"></i>
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <i className="fas fa-trash text-red-500 cursor-pointer hover:text-red-700 transition-colors duration-200"></i>
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

export default ShowMedicines;