import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "./comp/Sidebar.jsx";
import Modal from "react-modal";
import Header from "./comp/Header.jsx";

const ShowPatients = () => {
    const [patients, setPatients] = useState([]);
    const [ministryName, setMinistryName] = useState("أحمد محمد"); // اسم عامل الوزارة
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [patientToEdit, setPatientToEdit] = useState(null);
    const [editedPatientData, setEditedPatientData] = useState({
        name: "",
        identity_number: "",
        birth_date: "",
        phoneNumber: "",
    });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [deletionAttempted, setDeletionAttempted] = useState(false);

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
                patient.identity_number.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPatients(filtered);
    };

    const openEditModal = (patient) => {
        setPatientToEdit(patient);
        setEditedPatientData({
            name: patient.name,
            identity_number: patient.identity_number,
            birth_date: patient.birth_date,
            phoneNumber: patient.phoneNumber,
        });
        setEditModalIsOpen(true);
    };

    const closeEditModal = () => {
        setEditModalIsOpen(false);
        setPatientToEdit(null);
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const handleEditChange = (e) => {
        setEditedPatientData({
            ...editedPatientData,
            [e.target.name]: e.target.value,
        });
    };

    const confirmEdit = async () => {
        setIsDeleting(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `http://127.0.0.1:8000/api/updatepatient/${patientToEdit.id}`,
                editedPatientData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.status === 200) {
                fetchData();
                setSuccessMessage("تم تحديث المريض بنجاح.");
            } else {
                setErrorMessage(`حدث خطأ أثناء التحديث: رمز الحالة ${response.status}`);
            }
        } catch (error) {
            console.error("خطأ في التحديث:", error);
            if (error.response) {
                setErrorMessage(`حدث خطأ أثناء التحديث: ${error.response.data.message || error.message}`);
            } else {
                setErrorMessage(`حدث خطأ أثناء التحديث: ${error.message}`);
            }
        } finally {
            setIsDeleting(false);
            setTimeout(() => {
                closeEditModal();
            }, 3000);
        }
    };

    const handleEdit = (patient) => {
        openEditModal(patient);
    };

    const openModal = (id) => {
        setPatientToDelete(id);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setPatientToDelete(null);
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        setDeletionAttempted(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`http://127.0.0.1:8000/api/deletepatient/${patientToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                fetchData();
                setSuccessMessage("تم حذف المريض بنجاح.");
            } else {
                setErrorMessage(`حدث خطأ أثناء الحذف: رمز الحالة ${response.status}`);
            }
        } catch (error) {
            console.error("خطأ في الحذف:", error);
            if (error.response) {
                setErrorMessage(`حدث خطأ أثناء الحذف: ${error.response.data.message || error.message}`);
            } else {
                setErrorMessage(`حدث خطأ أثناء الحذف: ${error.message}`);
            }
        } finally {
            setIsDeleting(false);
            setTimeout(() => {
                closeModal();
            }, 3000);
        }
    };

    const handleDelete = (id) => {
        openModal(id);
    };


    if (loading) return <div className="text-center">جاري التحميل...</div>;

    if (error) return <div className="text-center text-red-500">حدث خطأ: {error}</div>;

    return (
        <div dir={"rtl"} className="flex min-h-screen bg-gray-100">
            {/* ... (Modal للحذف) */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="تأكيد الحذف"
                className="Modal"
                overlayClassName="Overlay"
            >
                <div className="flex flex-col items-center justify-center p-6">
                    {deletionAttempted ? (
                        <>
                            {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
                            {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
                        </>
                    ) : (
                        <>
                            <h2 className="text-lg font-bold mb-4">هل أنت متأكد من حذف هذا المريض؟</h2>
                            <div className="flex space-x-4">
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                    onClick={confirmDelete}
                                    disabled={isDeleting} // تعطيل الزر أثناء الحذف
                                >
                                    {isDeleting ? "جاري الحذف..." : "تأكيد"}
                                </button>
                                <button
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                    onClick={closeModal}
                                    disabled={isDeleting} // تعطيل الزر أثناء الحذف
                                >
                                    إلغاء
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
            <Modal
                isOpen={editModalIsOpen}
                onRequestClose={closeEditModal}
                contentLabel="تعديل المريض"
                className="Modal"
                overlayClassName="Overlay"
            >
                <div className="flex flex-col items-center justify-center p-6">
                    {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
                    {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
                    <h2 className="text-lg font-bold mb-4">تعديل بيانات المريض</h2>
                    <input
                        type="text"
                        name="name"
                        value={editedPatientData.name}
                        onChange={handleEditChange}
                        placeholder="اسم المريض"
                        className="w-full px-4 py-2 border rounded-lg mb-2"
                    />
                    <input
                        type="text"
                        name="identity_number"
                        value={editedPatientData.identity_number}
                        onChange={handleEditChange}
                        placeholder="الرقم الوطني"
                        className="w-full px-4 py-2 border rounded-lg mb-2"
                    />
                    <input
                        type="date"
                        name="birth_date"
                        value={editedPatientData.birth_date}
                        onChange={handleEditChange}
                        placeholder="تاريخ الميلاد"
                        className="w-full px-4 py-2 border rounded-lg mb-2"
                    />
                    <input
                        type="text"
                        name="phoneNumber"
                        value={editedPatientData.phoneNumber}
                        onChange={handleEditChange}
                        placeholder="رقم الجوال"
                        className="w-full px-4 py-2 border rounded-lg mb-4"
                    />
                    <div className="flex space-x-4">
                        <button
                            className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition"
                            onClick={confirmEdit}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "جاري التحديث..." : "تأكيد"}
                        </button>
                        <button
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                            onClick={closeEditModal}
                            disabled={isDeleting}
                        >
                            إلغاء
                        </button>
                    </div>
                </div>
            </Modal>
            {/* الشريط الجانبي */}
            <Sidebar/>

            {/* Main content */}
            <main className="flex-1 ">
                {/* Header */}
               <Header/>

                {/* Search bar and add button */}
                <div className="flex justify-between items-center mb-6 p-6">
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
                <section className={'p-6'}>
                    <h3 className="text-lg font-bold text-gray-700 mb-4">قائمة المرضى</h3>
                    <table className="w-full border-collapse bg-white shadow-lg rounded-lg ">
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
                                <td className="px-4 py-2 text-right">{patient.identity_number}</td>
                                <td className="px-4 py-2 text-right">{patient.birth_date}</td>
                                <td className="px-4 py-2 text-right">{patient.phoneNumber}</td>
                                <td className="px-4 py-2 text-right">
                                    <i
                                        className="fas fa-edit text-cyan-700 cursor-pointer"
                                        onClick={() => handleEdit(patient)}
                                    ></i>
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