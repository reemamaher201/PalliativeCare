import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPills, FaTags, FaClipboard, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Sidebar from "./component/Sidebar.jsx";
import Navbar from "./component/proNavbar.jsx";
import ChatButton from "../Utilties/ChatButton.jsx";
import EditMedicineModal from "./EditMedicineModal.jsx";
import { Link } from "react-router-dom";

const ProviderMedicines = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editMedicine, setEditMedicine] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingMedicines, setEditingMedicines] = useState([]);
    const [deletingMedicines, setDeletingMedicines] = useState([]);
    const fetchMedicines = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("لم يتم العثور على التوكن. يرجى تسجيل الدخول.");
                setLoading(false);
                return;
            }

            const response = await axios.get("http://127.0.0.1:8000/api/provider/medicines", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMedicines(response.data);
        } catch (err) {
            console.error("Error fetching provider medicines:", err);
            setError(err.response?.data?.message || "حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (medicine) => {
        // السماح بالتعديل إذا لم يكن هناك طلب تعديل معلق (edit_status !== 1)
        if (medicine.edit_status !== 1) {
            setEditMedicine(medicine);
            setIsEditModalOpen(true);
        }
    };

    const handleSave = async (updatedMedicine) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("لم يتم العثور على التوكن. يرجى تسجيل الدخول.");
                return;
            }

            // إضافة الدواء إلى قائمة الأدوية التي يتم تعديلها
            setEditingMedicines((prev) => [...prev, updatedMedicine.id]);

            // إرسال طلب التعديل إلى API
            const response = await axios.post(
                `http://127.0.0.1:8000/api/medicines/${updatedMedicine.id}/request-edit`,
                updatedMedicine,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                alert("تم إرسال طلب التعديل بنجاح. انتظر موافقة الوزارة.");

                // تحديث حالة الدواء إلى "معلق للتعديل"
                setMedicines((prevMedicines) =>
                    prevMedicines.map((medicine) =>
                        medicine.id === updatedMedicine.id ? { ...medicine, edit_status: 1 } : medicine
                    )
                );

                // انتظار ثانيتين قبل تحديث البيانات لضمان بقاء رمز التحميل ظاهرًا
                setTimeout(() => {
                    fetchMedicines();
                    setEditingMedicines((prev) => prev.filter((id) => id !== updatedMedicine.id)); // إزالة الدواء من قائمة الأدوية بعد التحديث
                }, 2000);
            }
        } catch (err) {
            console.error("Error sending edit request:", err);
            setError(err.response?.data?.message || "حدث خطأ أثناء إرسال طلب التعديل. يرجى المحاولة مرة أخرى.");

            // إذا فشل الطلب، إزالة الدواء من قائمة الأدوية التي يتم تعديلها
            setEditingMedicines((prev) => prev.filter((id) => id !== updatedMedicine.id));
        }
    };





    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("لم يتم العثور على التوكن. يرجى تسجيل الدخول.");
                return;
            }

            // إضافة الدواء إلى قائمة الأدوية التي يتم حذفها
            setDeletingMedicines((prev) => [...prev, id]);

            // إرسال طلب الحذف إلى API
            const response = await axios.post(
                `http://127.0.0.1:8000/api/medicines/${id}/request-delete`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                alert("تم إرسال طلب الحذف بنجاح. انتظر موافقة الوزارة.");

                // تحديث حالة الدواء إلى "طلب حذف معلق"
                setMedicines((prevMedicines) =>
                    prevMedicines.map((medicine) =>
                        medicine.id === id ? { ...medicine, delete_status: 1 } : medicine
                    )
                );

                // إزالة الدواء من قائمة الأدوية التي يتم حذفها بعد التحديث
                setDeletingMedicines((prev) => prev.filter((medicineId) => medicineId !== id));
            }
        } catch (err) {
            console.error("Error requesting medicine deletion:", err);
            setError(err.response?.data?.message || "حدث خطأ أثناء إرسال طلب الحذف. يرجى المحاولة مرة أخرى.");

            // إذا فشل الطلب، إزالة الدواء من قائمة الأدوية التي يتم حذفها
            setDeletingMedicines((prev) => prev.filter((medicineId) => medicineId !== id));
        }
    };


    useEffect(() => {
        fetchMedicines();
        const interval = setInterval(fetchMedicines, 5000);
        return () => clearInterval(interval);
    }, []);


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
                <p className="mt-4 text-lg font-semibold text-cyan-500">جاري تحميل البيانات...</p>
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
                <Navbar />
                <div className="flex justify-end m-4">
                    <Link to="/med/request">
                        <button className="bg-cyan-500 text-white py-2 px-4 rounded hover:bg-cyan-700 flex items-center">
                            <FaPlus className="mr-2" />
                            إضافة دواء
                        </button>
                    </Link>
                </div>
                <section className="p-6">
                    <h2 className="text-2xl font-bold text-cyan-700 mb-6 text-center">الأدوية التي تمت إضافتها</h2>

                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="grid grid-cols-5 bg-cyan-500 text-white p-3 font-bold text-center">
                            <span>اسم الدواء</span>
                            <span>التصنيف</span>
                            <span>الوصف</span>
                            <span>تعديل</span>
                            <span>حذف</span>
                        </div>

                        {medicines.length > 0 ? (
                            medicines.map((medicine, index) => (
                                <div key={index} className="grid grid-cols-5 border-b p-4 items-center text-gray-700 text-center">
                                    <p className="flex items-center gap-2 justify-center"><FaPills className="text-cyan-500" /> {medicine.name}</p>
                                    <p className="flex items-center gap-2 justify-center"><FaTags className="text-cyan-500" /> {medicine.type}</p>
                                    <p className="flex items-center gap-2 justify-center"><FaClipboard className="text-cyan-500" /> {medicine.description}</p>

                                    <button
                                        onClick={() => handleEdit(medicine)}
                                        className={`flex items-center gap-2 justify-center ${
                                            medicine.edit_status === 1 || medicine.delete_status === 1 || editingMedicines.includes(medicine.id)
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-cyan-500 hover:text-cyan-700'
                                        }`}
                                        disabled={medicine.edit_status === 1 || medicine.delete_status === 1 || editingMedicines.includes(medicine.id)}
                                    >
                                        {editingMedicines.includes(medicine.id) || medicine.edit_status === 1 ? (
                                            <span className="animate-spin">⏳</span>
                                        ) : (
                                            <FaEdit />
                                        )}
                                    </button>

                                    <button
                                        onClick={() => handleDelete(medicine.id)}
                                        className={`flex items-center gap-2 justify-center ${
                                            medicine.delete_status === 1 || medicine.edit_status === 1 || deletingMedicines.includes(medicine.id)
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-red-500 hover:text-red-700'
                                        }`}
                                        disabled={medicine.delete_status === 1 || medicine.edit_status === 1 || deletingMedicines.includes(medicine.id)}
                                    >
                                        {deletingMedicines.includes(medicine.id) || medicine.delete_status === 1 ? (
                                            <span className="animate-spin">⏳</span>
                                        ) : (
                                            <FaTrash />
                                        )}
                                    </button>




                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6">
                                <p className="text-gray-600 text-lg">🚫 لا توجد أدوية مسجلة بعد.</p>
                                <Link to="/med/request" className="mt-4">
                                    <button className="bg-cyan-500 text-white py-2 px-4 rounded hover:bg-cyan-700 flex items-center">
                                        <FaPlus className="mr-2" />
                                        إضافة دواء جديد
                                    </button>
                                </Link>
                            </div>
                        )}

                    </div>
                </section>
                <EditMedicineModal
                    medicine={editMedicine}
                    isOpen={isEditModalOpen}
                    onRequestClose={() => setIsEditModalOpen(false)}
                    onSave={handleSave}
                />
            </main>
            <ChatButton />

        </div>
    );
};

export default ProviderMedicines;