import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPills, FaTag, FaBarcode, FaEdit, FaTrash, FaAudioDescription, FaClipboard, FaTags } from "react-icons/fa";
import Sidebar from "./component/Sidebar.jsx";
import Navbar from "./component/Navbar.jsx";
import ChatButton from "../Utilties/ChatButton.jsx";
// import EditMedicineModal from "./EditMedicineModal.jsx";

const ProviderMedicines = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editMedicine, setEditMedicine] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
        setEditMedicine(medicine);
        setIsEditModalOpen(true);
    };

    const handleSave = async (updatedMedicine) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("لم يتم العثور على التوكن. يرجى تسجيل الدخول.");
                return;
            }

            // إرسال طلب التعديل
            const response = await axios.put(
                `http://127.0.0.1:8000/api/med-requests/${updatedMedicine.id}`,
                updatedMedicine,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                alert("تم تحديث الدواء بنجاح!");
                setIsEditModalOpen(false);
                fetchMedicines(); // إعادة جلب البيانات لتحديث القائمة
            }
        } catch (err) {
            console.error("Error updating medicine:", err);
            setError(err.response?.data?.message || "حدث خطأ أثناء تعديل الدواء. يرجى المحاولة مرة أخرى.");
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("لم يتم العثور على التوكن. يرجى تسجيل الدخول.");
                return;
            }

            // تحديث حالة الدواء إلى "طلب حذف معلق" محليًا
            setMedicines(prevMedicines =>
                prevMedicines.map(medicine =>
                    medicine.id === id ? { ...medicine, delete_status: 1 } : medicine
                )
            );

            // إرسال طلب الحذف
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
                fetchMedicines(); // إعادة جلب البيانات لتحديث القائمة من السيرفر
            }
        } catch (err) {
            console.error("Error requesting medicine deletion:", err);
            setError(err.response?.data?.message || "حدث خطأ أثناء إرسال طلب الحذف. يرجى المحاولة مرة أخرى.");

            // إذا تم رفض الطلب، قم بإعادة تمكين الأزرار
            setMedicines(prevMedicines =>
                prevMedicines.map(medicine =>
                    medicine.id === id ? { ...medicine, delete_status: 2 } : medicine
                )
            );
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

                                    {/* تعطيل زر التعديل إذا كان الدواء في حالة "معلق للحذف" */}
                                    <button
                                        onClick={() => handleEdit(medicine)}
                                        className={`flex items-center gap-2 justify-center ${medicine.delete_status === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-cyan-500 hover:text-cyan-700'}`}
                                        disabled={medicine.delete_status === 1}
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(medicine.id)}
                                        className={`flex items-center gap-2 justify-center ${medicine.delete_status === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:text-red-700'}`}
                                        disabled={medicine.delete_status === 1}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 text-center py-4">لا توجد بيانات للأدوية.</p>
                        )}

                    </div>
                </section>
            </main>
            <ChatButton />
            {/*<EditMedicineModal*/}
            {/*    medicine={editMedicine}*/}
            {/*    isOpen={isEditModalOpen}*/}
            {/*    onRequestClose={() => setIsEditModalOpen(false)}*/}
            {/*    onSave={handleSave}*/}
            {/*/>*/}
        </div>
    );
};

export default ProviderMedicines;