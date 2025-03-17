import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "./comp/Sidebar.jsx";
import Modal from "react-modal";

const ShowNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [notificationToDelete, setNotificationToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [deletionAttempted, setDeletionAttempted] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [notificationToEdit, setNotificationToEdit] = useState(null);
    const [editedNotificationData, setEditedNotificationData] = useState({
        title: "",
        text: "",
        date: "",
        recipient: "",
    });

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        filterNotifications();
    }, [notifications, searchQuery]);

    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8000/api/notifications", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(response.data);
        } catch (error) {
            console.error("خطأ في جلب الإشعارات:", error);
            setError("حدث خطأ أثناء جلب الإشعارات.");
        } finally {
            setLoading(false);
        }
    };

    const filterNotifications = () => {
        const filtered = notifications.filter(
            (notification) =>
                notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                notification.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                notification.recipient.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredNotifications(filtered);
    };

    const openModal = (id) => {
        setNotificationToDelete(id);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setNotificationToDelete(null);
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
            const response = await axios.delete(`http://localhost:8000/api/deletenotification/${notificationToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                fetchNotifications();
                setSuccessMessage("تم حذف الإشعار بنجاح.");
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

    const openEditModal = (notification) => {
        setNotificationToEdit(notification);
        setEditedNotificationData({
            title: notification.title,
            text: notification.text,
            date: notification.date,
            recipient: notification.recipient,
        });
        setEditModalIsOpen(true);
    };

    const closeEditModal = () => {
        setEditModalIsOpen(false);
        setNotificationToEdit(null);
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const handleEditChange = (e) => {
        setEditedNotificationData({
            ...editedNotificationData,
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
                `http://localhost:8000/api/updatenotification/${notificationToEdit.id}`,
                editedNotificationData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.status === 200) {
                fetchNotifications();
                setSuccessMessage("تم تحديث الإشعار بنجاح.");
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

    const handleEdit = (notification) => {
        openEditModal(notification);
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
                            <h2 className="text-lg font-bold mb-4">هل أنت متأكد من حذف هذا الإشعار؟</h2>
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
                contentLabel="تعديل الإشعار"
                className="Modal"
                overlayClassName="Overlay"
            >
                <div className="flex flex-col items-center justify-center p-6">
                    {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
                    {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
                    <h2 className="text-lg font-bold mb-4">تعديل بيانات الإشعار</h2>
                    <input
                        type="text"
                        name="title"
                        value={editedNotificationData.title}
                        onChange={handleEditChange}
                        placeholder="عنوان الإشعار"
                        className="w-full px-4 py-2 border rounded-lg mb-2"
                    />
                    <textarea
                        name="text"
                        value={editedNotificationData.text}
                        onChange={handleEditChange}
                        placeholder="نص الإشعار"
                        className="w-full px-4 py-2 border rounded-lg mb-2"
                    />
                    <input
                        type="date"
                        name="date"
                        value={editedNotificationData.date}
                        onChange={handleEditChange}
                        placeholder="تاريخ الإرسال"
                        className="w-full px-4 py-2 border rounded-lg mb-2"
                    />
                    <input
                        type="text"
                        name="recipient"
                        value={editedNotificationData.recipient}
                        onChange={handleEditChange}
                        placeholder="المرسل له"
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
            <Sidebar />

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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className="absolute top-2 left-3 text-gray-400">
                            <i className="fas fa-search"></i>
                        </span>
                    </div>
                    <button>
                        <Link
                            to="/addnotification"
                            className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition"
                        >
                            إضافة إشعار جديد
                        </Link>
                    </button>
                </div>

                <section>
                    <h3 className="text-lg font-bold text-gray-700 mb-4">الإشعارات</h3>
                    <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
                        <thead>
                        <tr className="bg-cyan-500 text-white">
                            <th className="px-4 py-2 text-right">عنوان الإشعار</th>
                            <th className="px-4 py-2 text-right">نص الإشعار</th>
                            <th className="px-4 py-2 text-right">تاريخ الإرسال</th>
                            <th className="px-4 py-2 text-right">المرسل له</th>
                            <th className="px-4 py-2 text-right">تعديل</th>
                            <th className="px-4 py-2 text-right">حذف</th>
                        </tr>
                        </thead>
                        <tbody>

                        {filteredNotifications.map((notification) => (
                            <tr key={notification.id} className="border-b transition-colors duration-200 hover:bg-gray-100">
                                <td className="px-4 py-2 text-right">{notification.title}</td>
                                <td className="px-4 py-2 text-right">{notification.text}</td>
                                <td className="px-4 py-2 text-right">{notification.date}</td>
                                <td className="px-4 py-2 text-right">{notification.recipient}</td>
                                <td className="px-4 py-2 text-right">
                                    <i
                                        className="fas fa-edit text-cyan-700 cursor-pointer hover:text-cyan-900 transition-colors duration-200"
                                        onClick={() => handleEdit(notification)}
                                    ></i>
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <i
                                        className="fas fa-trash text-red-500 cursor-pointer hover:text-red-700 transition-colors duration-200"
                                        onClick={() => handleDelete(notification.id)}
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

export default ShowNotifications;