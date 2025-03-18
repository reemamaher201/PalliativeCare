import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaIdCard, FaPhone, FaMapMarkerAlt, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Sidebar from "./component/Sidebar.jsx";
import Navbar from "./component/Navbar.jsx";
import ChatButton from "../Utilties/ChatButton.jsx";
import EditPatientModal from "./EditPatientModal.jsx";
import { Link } from "react-router-dom";

const ProviderPatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editPatient, setEditPatient] = useState(null);
    const [editingPatients, setEditingPatients] = useState([]); // حالة لطلبات التعديل
    const [deletingPatients, setDeletingPatients] = useState([]); // حالة لطلبات الحذف

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);


    const fetchPatients = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("لم يتم العثور على التوكن. يرجى تسجيل الدخول.");
                setLoading(false);
                return;
            }

            const response = await axios.get("http://127.0.0.1:8000/api/provider/patients", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setPatients(response.data);
        } catch (err) {
            console.error("Error fetching provider patients:", err);
            setError(err.response?.data?.message || "حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (patient) => {
        if (patient.edit_status === 0) {
            setEditPatient(patient); // تعيين بيانات المريض
            setIsEditModalOpen(true); // فتح المودال
        }
    };

    const handleSave = async (updatedPatient) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("لم يتم العثور على التوكن. يرجى تسجيل الدخول.");
                return;
            }

            // إضافة المريض إلى قائمة المرضى الذين يتم تعديلهم
            setEditingPatients((prev) => [...prev, updatedPatient.id]);

            // إرسال طلب التعديل إلى API
            const response = await axios.post(

                `http://127.0.0.1:8000/api/medicines/${updatedPatient.id}/request-edit`,
                updatedPatient,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 201) {
                alert("تم إرسال طلب التعديل بنجاح. انتظر الموافقة من الوزارة.");

                // تحديث حالة المريض إلى "معلق للتعديل"
                setPatients((prevPatients) =>
                    prevPatients.map((patient) =>
                        patient.id === updatedPatient.id ? { ...patient, edit_status: 1 } : patient
                    )
                );

                // إزالة المريض من قائمة المرضى الذين يتم تعديلهم بعد التحديث
                setTimeout(() => {
                    fetchPatients();
                    setEditingPatients((prev) => prev.filter((id) => id !== updatedPatient.id));
                }, 2000);
            }
        } catch (err) {
            console.error("Error updating patient:", err);
            setError(err.response?.data?.message || "حدث خطأ أثناء تعديل المريض. يرجى المحاولة مرة أخرى.");

            // إذا فشل الطلب، إزالة المريض من قائمة المرضى الذين يتم تعديلهم
            setEditingPatients((prev) => prev.filter((id) => id !== updatedPatient.id));
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("لم يتم العثور على التوكن. يرجى تسجيل الدخول.");
                return;
            }

            // إضافة المريض إلى قائمة المرضى الذين يتم حذفهم
            setDeletingPatients((prev) => [...prev, id]);

            // إرسال طلب الحذف إلى API
            const response = await axios.post(
                `http://127.0.0.1:8000/api/patients/${id}/request-delete`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                alert("تم إرسال طلب الحذف بنجاح. انتظر موافقة الوزارة.");

                // تحديث حالة المريض إلى "طلب حذف معلق"
                setPatients((prevPatients) =>
                    prevPatients.map((patient) =>
                        patient.id === id ? { ...patient, delete_status: 1 } : patient
                    )
                );

                // إزالة المريض من قائمة المرضى الذين يتم حذفهم بعد التحديث
                setDeletingPatients((prev) => prev.filter((patientId) => patientId !== id));
            }
        } catch (err) {
            console.error("Error requesting patient deletion:", err);
            setError(err.response?.data?.message || "حدث خطأ أثناء إرسال طلب الحذف. يرجى المحاولة مرة أخرى.");

            // إذا فشل الطلب، إزالة المريض من قائمة المرضى الذين يتم حذفهم
            setDeletingPatients((prev) => prev.filter((patientId) => patientId !== id));
        }
    };

    useEffect(() => {
        fetchPatients();
        const interval = setInterval(fetchPatients, 5000);
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
                    <Link to="/patients/request">
                        <button className="bg-cyan-500 text-white py-2 px-4 rounded hover:bg-cyan-700 flex items-center">
                            <FaPlus className="mr-2" />
                            إضافة مريض
                        </button>
                    </Link>
                </div>
                <section className="p-6">
                    <h2 className="text-2xl font-bold text-cyan-700 mb-6 text-center">المرضى الذين تمت إضافتهم</h2>

                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="grid grid-cols-6 bg-cyan-500 text-white p-3 font-bold text-center">
                            <span>الاسم</span>
                            <span>رقم الهوية</span>
                            <span>رقم الجوال</span>
                            <span>العنوان</span>
                            <span>تعديل</span>
                            <span>حذف</span>
                        </div>

                        {patients.length > 0 ? (
                            patients.map((patient, index) => (
                                <div key={index} className="grid grid-cols-6 border-b p-4 items-center text-gray-700 text-center">
                                    <p className="flex items-center gap-2 justify-center"><FaUser className="text-cyan-500" /> {patient.name}</p>
                                    <p className="flex items-center gap-2 justify-center"><FaIdCard className="text-cyan-500" /> {patient.identity_number}</p>
                                    <p className="flex items-center gap-2 justify-center"><FaPhone className="text-cyan-500" /> {patient.added_by.phoneNumber}</p>
                                    <p className="flex items-center gap-2 justify-center"><FaMapMarkerAlt className="text-cyan-500" /> {patient.address}</p>

                                    <button
                                        onClick={() => handleEdit(patient)}
                                        className={`flex items-center gap-2 justify-center ${
                                            patient.edit_status === 1 || patient.delete_status === 1 || editingPatients.includes(patient.id)
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-cyan-500 hover:text-cyan-700'
                                        }`}
                                        disabled={patient.edit_status === 1 || patient.delete_status === 1 || editingPatients.includes(patient.id)}
                                    >
                                        {editingPatients.includes(patient.id) || patient.edit_status === 1 ? (
                                            <span className="animate-spin">⏳</span>
                                        ) : (
                                            <FaEdit />
                                        )}
                                    </button>

                                    <button
                                        onClick={() => handleDelete(patient.id)}
                                        className={`flex items-center gap-2 justify-center ${
                                            patient.delete_status === 1 || patient.edit_status === 1 || deletingPatients.includes(patient.id)
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-red-500 hover:text-red-700'
                                        }`}
                                        disabled={patient.delete_status === 1 || patient.edit_status === 1 || deletingPatients.includes(patient.id)}
                                    >
                                        {deletingPatients.includes(patient.id) || patient.delete_status === 1 ? (
                                            <span className="animate-spin">⏳</span>
                                        ) : (
                                            <FaTrash />
                                        )}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 text-center py-4">لا توجد بيانات للمرضى.</p>
                        )}
                    </div>
                </section>
                <EditPatientModal
                    patient={editPatient} // تأكد من أن `editPatient` يحتوي على البيانات الصحيحة
                    isOpen={isEditModalOpen} // تأكد من أن `isEditModalOpen` يتم تحديثه بشكل صحيح
                    onRequestClose={() => setIsEditModalOpen(false)} // تأكد من إغلاق المودال
                    onSave={handleSave} // تأكد من أن دالة الحفظ تعمل بشكل صحيح
                />
            </main>
            <ChatButton />

        </div>
    );
};

export default ProviderPatients;