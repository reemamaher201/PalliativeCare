import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import Sidebar from "./comp/Sidebar.jsx";

const ShowProvider = () => {
    const [providers, setProviders] = useState([]);
    const [ministryName, setMinistryName] = useState("أحمد محمد");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProviders, setFilteredProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [providerToDelete, setProviderToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null); // حالة لرسالة الخطأ
    const [successMessage, setSuccessMessage] = useState(null); // حالة لرسالة النجاح
    const [deletionAttempted, setDeletionAttempted] = useState(false); // حالة لتتبع محاولة الحذف
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [providerToEdit, setProviderToEdit] = useState(null);
    const [editedProviderData, setEditedProviderData] = useState({
        name: "",
        username: "",
        email: "",
        phoneNumber: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterProviders();
    }, [providers, searchQuery]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/api/showprovider", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProviders(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const filterProviders = () => {
        const filtered = providers.filter(
            (provider) =>
                provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                provider.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProviders(filtered);
    };

    const openModal = (id) => {
        setProviderToDelete(id);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setProviderToDelete(null);
        setErrorMessage(null); // مسح رسالة الخطأ عند إغلاق النافذة
        setSuccessMessage(null); // مسح رسالة النجاح عند إغلاق النافذة
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        setDeletionAttempted(true); // تم محاولة الحذف
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`http://127.0.0.1:8000/api/deleteprovider/${providerToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                fetchData();
                setSuccessMessage("تم حذف المزود بنجاح.");
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
        console.log("Deleting provider with ID:", id); // فحص الـ ID
        openModal(id);
    };

    const openEditModal = (provider) => {
        setProviderToEdit(provider);
        setEditedProviderData({
            name: provider.name,
            username: provider.username,
            email: provider.email,
            phoneNumber: provider.phoneNumber,
        });
        setEditModalIsOpen(true);
    };

    const closeEditModal = () => {
        setEditModalIsOpen(false);
        setProviderToEdit(null);
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const handleEditChange = (e) => {
        setEditedProviderData({
            ...editedProviderData,
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
                `http://127.0.0.1:8000/api/updateprovider/${providerToEdit.id}`,
                editedProviderData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.status === 200) {
                fetchData();
                setSuccessMessage("تم تحديث المزود بنجاح.");
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
            }, 1000);
        }
    };

    const handleEdit = (provider) => {
        openEditModal(provider);
    };


    if (loading) return <div>جاري التحميل...</div>;
    if (error) return <div>حدث خطأ: {error.message}</div>;

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
                    {/* عرض رسالة النجاح أو الخطأ فقط بعد محاولة الحذف */}
                    {deletionAttempted ? (
                        <>
                            {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
                            {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
                        </>
                    ) : (
                        <>
                            <h2 className="text-lg font-bold mb-4">هل أنت متأكد من حذف هذا المزود؟</h2>
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
                contentLabel="تعديل المزود"
                className="Modal"
                overlayClassName="Overlay"
            >
                <div className="flex flex-col items-center justify-center p-6">
                    {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
                    {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
                    <h2 className="text-lg font-bold mb-4">تعديل بيانات المزود</h2>
                    <input
                        type="text"
                        name="name"
                        value={editedProviderData.name}
                        onChange={handleEditChange}
                        placeholder="اسم المزود"
                        className="w-full px-4 py-2 border rounded-lg mb-2"
                    />
                    <input
                        type="text"
                        name="username"
                        value={editedProviderData.username}
                        onChange={handleEditChange}
                        placeholder="اسم المستخدم"
                        className="w-full px-4 py-2 border rounded-lg mb-2"
                    />
                    <input
                        type="email"
                        name="email"
                        value={editedProviderData.email}
                        onChange={handleEditChange}
                        placeholder="البريد الإلكتروني"
                        className="w-full px-4 py-2 border rounded-lg mb-2"
                    />
                    <input
                        type="text"
                        name="phoneNumber"
                        value={editedProviderData.phoneNumber}
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

            <main className="flex-1 p-6">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">{ministryName}</h1>
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className="absolute top-2 left-3 text-gray-400">
                            <i className="fas fa-search"></i>
                        </span>
                    </div>
                    <Link
                        to="/addprovider"
                        className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition"
                    >
                        إضافة مزود جديد
                    </Link>
                </div>

                <section>
                    <h3 className="text-lg font-bold text-gray-700 mb-4">قائمة المزودين</h3>
                    <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-right">اسم المزود</th>
                            <th className="px-4 py-2 text-right">اسم المستخدم</th>
                            <th className="px-4 py-2 text-right">رقم الجوال</th>
                            <th className="px-4 py-2 text-right">البريد الإلكتروني للتواصل</th>
                            <th className="px-4 py-2 text-right">تعديل</th>
                            <th className="px-4 py-2 text-right">حذف</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredProviders.map((provider) => (
                            <tr key={provider.id} className="border-b">
                                <td className="px-4 py-2 text-right">{provider.name}</td>
                                <td className="px-4 py-2 text-right">{provider.username}</td>
                                <td className="px-4 py-2 text-right">{provider.phoneNumber}</td>
                                <td className="px-4 py-2 text-right">{provider.email}</td>
                                <td className="px-4 py-2 text-right">
                                    <i
                                        className="fas fa-edit text-cyan-700 cursor-pointer"
                                        onClick={() => handleEdit(provider)}
                                    ></i>
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <i
                                        className="fas fa-trash text-red-500 cursor-pointer"
                                        onClick={() => handleDelete(provider.id)}
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

export default ShowProvider;