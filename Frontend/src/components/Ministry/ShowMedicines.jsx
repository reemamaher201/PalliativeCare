import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "./comp/Sidebar.jsx";
import Modal from "react-modal";

const ShowMedicines = () => {
    const [medicines, setMedicines] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredMedicines, setFilteredMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [medicineToDelete, setMedicineToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [deletionAttempted, setDeletionAttempted] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [medicineToEdit, setMedicineToEdit] = useState(null);
    const [editedMedicineData, setEditedMedicineData] = useState({
        name: "",
        description: "",
        distributed_quantity: "",
        required_quantity: "",
        locations: "",
        next_distribution_date: "",
    });

    useEffect(() => {
        fetchMedicines();
    }, []);

    useEffect(() => {
        filterMedicines();
    }, [medicines, searchQuery]);

    const fetchMedicines = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8000/api/showmedicines", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMedicines(response.data.medicines);
        } catch (error) {
            console.error("There was an error fetching the medicines!", error);
            setError("حدث خطأ أثناء جلب الأدوية.");
        } finally {
            setLoading(false);
        }
    };

    const filterMedicines = () => {
        const filtered = medicines.filter(
            (medicine) =>
                medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                medicine.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredMedicines(filtered);
    };

    const openModal = (id) => {
        setMedicineToDelete(id);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setMedicineToDelete(null);
        setErrorMessage(null);
        setSuccessMessage(null);
        setDeletionAttempted(false);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        setDeletionAttempted(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`http://localhost:8000/api/deletemedicine/${medicineToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                fetchMedicines();
                setSuccessMessage("تم حذف الدواء بنجاح.");
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
    const openEditModal = (medicine) => {
        setMedicineToEdit(medicine);
        setEditedMedicineData({
            name: medicine.name,
            description: medicine.description,
            distributed_quantity: medicine.distributed_quantity,
            required_quantity: medicine.required_quantity,
            locations: medicine.locations,
            next_distribution_date: medicine.next_distribution_date,
        });
        setEditModalIsOpen(true);
    };

    const closeEditModal = () => {
        setEditModalIsOpen(false);
        setMedicineToEdit(null);
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const handleEditChange = (e) => {
        setEditedMedicineData({
            ...editedMedicineData,
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
                `http://localhost:8000/api/updatemedicine/${medicineToEdit.id}`,
                editedMedicineData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.status === 200) {
                fetchMedicines();
                setSuccessMessage("تم تحديث الدواء بنجاح.");
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

    const handleEdit = (medicine) => {
        openEditModal(medicine);
    };
    if (loading) return <div className="text-center">جاري التحميل...</div>;
    if (error) return <div className="text-center text-red-500">حدث خطأ: {error}</div>;

    return (
        <div dir={"rtl"} className="flex min-h-screen bg-gray-100">
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
                            <h2 className="text-lg font-bold mb-4">هل أنت متأكد من حذف هذا الدواء؟</h2>
                            <div className="flex space-x-4">
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? "جاري الحذف..." : "تأكيد"}
                                </button>
                                <button
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                    onClick={closeModal}
                                    disabled={isDeleting}
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
                contentLabel="تعديل الدواء"
                className="Modal"
                overlayClassName="Overlay"
            >
                <div className="flex flex-col items-center justify-center p-6">
                    {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
                    {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
                    <h2 className="text-lg font-bold mb-4">تعديل بيانات الدواء</h2>
                    <input
                        type="text"
                        name="name"
                        value={editedMedicineData.name}
                        onChange={handleEditChange}
                        placeholder="اسم الدواء"
                        className="w-full px-4 py-2 border rounded-lg mb-2"
                    />
                    <input
                        type="text"
                        name="description"
                        value={editedMedicineData.description}
                        onChange={handleEditChange}
                        placeholder="الوصف"
                        className="w-full px-4 py-2 border rounded-lg mb-2"
                    />
                    <input
                        type="number"
                        name="distributed_quantity"
                        value={editedMedicineData.distributed_quantity}
                        onChange={handleEditChange}
                        placeholder="الكمية الموزعة"
                        className="w-full px-4 py-2 border rounded-lg mb-2"
                    />
                    <input
                        type="number"
                        name="required_quantity"
                        value={editedMedicineData.required_quantity}
                        onChange={handleEditChange}
                        placeholder="الكمية المطلوبة"
                        className="w-full px-4 py-2 border rounded-lg mb-2"
                    />
                    <input
                        type="text"
                        name="locations"
                        value={editedMedicineData.locations}
                        onChange={handleEditChange}
                        placeholder="أماكن التواجد"
                        className="w-full px-4 py-2 border rounded-lg mb-2"
                    />
                    <input
                        type="date"
                        name="next_distribution_date"
                        value={editedMedicineData.next_distribution_date}
                        onChange={handleEditChange}
                        placeholder="تاريخ التوزيع القادم"
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
                                    <i className="fas fa-edit text-cyan-700 cursor-pointer hover:text-cyan-900 transition-colors duration-200"  onClick = {()=>handleEdit(medicine)}></i>

                                </td>
                                <td className="px-4 py-2 text-right">
                                    <i
                                        className="fas fa-trash text-red-500 cursor-pointer hover:text-red-700 transition-colors duration-200"
                                        onClick={() => handleDelete(medicine.id)}
                                    ></i>
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