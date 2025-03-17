import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./comp/Sidebar.jsx";
import Header from "./comp/Header.jsx";
import { FaIdCard, FaUser, FaMapMarkerAlt, FaBirthdayCake, FaNotesMedical, FaVenusMars, FaPhone, FaClock, FaUserCircle } from "react-icons/fa";
import ChatButton from "../Utilties/ChatButton.jsx";

const RequestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isApproving, setIsApproving] = useState(false); // حالة تحميل خاصة بالقبول
    const [isRejecting, setIsRejecting] = useState(false); // حالة تحميل خاصة بالرفض

    const handleApprove = async () => {
        if (!window.confirm("هل أنت متأكد من الموافقة على هذا الطلب؟")) {
            return;
        }
        setIsApproving(true); // بدء تحميل زر القبول
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://127.0.0.1:8000/api/patients/approve/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('تمت الموافقة على الطلب بنجاح!');
            navigate('/patients/pending');
        } catch (error) {
            console.error('Error approving request:', error);
            alert('حدث خطأ أثناء الموافقة على الطلب.');
        } finally {
            setIsApproving(false); // انتهاء تحميل زر القبول
        }
    };

    const handleReject = async () => {
        if (!window.confirm("هل أنت متأكد من رفض هذا الطلب؟")) {
            return;
        }
        setIsRejecting(true); // بدء تحميل زر الرفض
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://127.0.0.1:8000/api/patients/reject/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('تم رفض الطلب بنجاح!');
            navigate('/patients/pending');
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('حدث خطأ أثناء رفض الطلب.');
        } finally {
            setIsRejecting(false); // انتهاء تحميل زر الرفض
        }
    };

    useEffect(() => {
        const fetchRequestDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://127.0.0.1:8000/api/patient-requests/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRequest(response.data);
            } catch (error) {
                console.error('Error fetching request details:', error);
                setError('حدث خطأ أثناء جلب تفاصيل الطلب.');
            } finally {
                setLoading(false);
            }
        };
        fetchRequestDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
                <p className="mt-4 text-lg font-semibold text-cyan-500">جاري تحميل تفاصيل الطلب...</p>
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
                <Header />
                <div className="p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-700">تفاصيل الطلب</h2>
                    {request && (
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 max-w-2xl mx-auto">
                            <div className="grid grid-cols-2 gap-4 text-gray-700">
                                <p className="flex items-center gap-2"><FaIdCard className="text-cyan-500" /> <strong>رقم الهوية:</strong> {request.identity_number}</p>
                                <p className="flex items-center gap-2"><FaUser className="text-cyan-500" /> <strong>الاسم:</strong> {request.name}</p>
                                <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-cyan-500" /> <strong>العنوان:</strong> {request.address}</p>
                                <p className="flex items-center gap-2"><FaBirthdayCake className="text-cyan-500" /> <strong>تاريخ الميلاد:</strong> {request.birth_date}</p>
                                <p className="flex items-center gap-2"><FaNotesMedical className="text-cyan-500" /> <strong>نوع الرعاية:</strong> {request.care_type}</p>
                                <p className="flex items-center gap-2"><FaVenusMars className="text-cyan-500" /> <strong>الجنس:</strong> {request.gender}</p>
                                <p className="flex items-center gap-2"><FaPhone className="text-cyan-500" /> <strong>رقم الجوال:</strong> {request.phoneNumber}</p>
                                <p className="flex items-center gap-2"><FaClock className="text-cyan-500" /> <strong>تاريخ الإرسال:</strong> {new Date(request.created_at).toLocaleString()}</p>
                                <p className="flex items-center gap-2"><FaUserCircle className="text-cyan-500" /> <strong>المرسل:</strong> {request.sender_name || "غير معروف"}</p>
                            </div>

                            <div className="mt-8 flex justify-end space-x-4">
                                <button
                                    onClick={handleApprove}
                                    disabled={isApproving || isRejecting} // تعطيل الزر إذا كان هناك تحميل (قبول أو رفض)
                                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300 disabled:opacity-50"
                                >
                                    {isApproving ? 'جاري المعالجة...' : 'قبول'}
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={isRejecting || isApproving} // تعطيل الزر إذا كان هناك تحميل (قبول أو رفض)
                                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300 disabled:opacity-50"
                                >
                                    {isRejecting ? 'جاري المعالجة...' : 'رفض'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            {/* زر الشات العائم */}
            <ChatButton />
        </div>
    );
};

export default RequestDetails;