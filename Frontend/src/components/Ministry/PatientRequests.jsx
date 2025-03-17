import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './comp/Sidebar';
import Navbar from './comp/Header.jsx';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const PatientRequests = () => {
    const [requests, setRequests] = useState([]);
    const [medRequests, setMedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [approvingId, setApprovingId] = useState(null);
    const [rejectingId, setRejectingId] = useState(null);
    const [deletionRequests, setDeletionRequests] = useState([]);
    const [deletionRequestsp, setDeletionRequestsp] = useState([]);


    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const [patientResponse, medResponse, deletionResponse,deletionResponsep] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/patients/pending', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get('http://127.0.0.1:8000/api/med/pending', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get('http://127.0.0.1:8000/api/deletion-requests', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get('http://127.0.0.1:8000/api/deletion-requestsp', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);
            setRequests(patientResponse.data);
            setMedRequests(medResponse.data);
            setDeletionRequests(deletionResponse.data);
            setDeletionRequestsp(deletionResponsep.data);

        } catch (error) {
            console.error('Error fetching requests:', error);
            setError('حدث خطأ أثناء جلب الطلبات.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleApprove = async (id, type) => {
        setApprovingId(id);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://127.0.0.1:8000/api/${type}/approve/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (type === "patients") {
                setRequests(requests.filter(request => request.id !== id));
            } else {
                setMedRequests(medRequests.filter(medRequest => medRequest.id !== id));
            }
        } catch (error) {
            console.error('Error approving request:', error);
        } finally {
            setApprovingId(null);
        }
    };


    const handleReject = async (id, type) => {
        setRejectingId(id);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://127.0.0.1:8000/api/${type}/reject/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (type === "patients") {
                setRequests(requests.filter(request => request.id !== id));
            } else {
                setMedRequests(medRequests.filter(medRequest => medRequest.id !== id));
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
        } finally {
            setRejectingId(null);
        }
    };
    const handleApproveDeletion = async (id) => {
        setApprovingId(id);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://127.0.0.1:8000/api/deletion-requests/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDeletionRequests(deletionRequests.filter(request => request.id !== id));
        } catch (error) {
            console.error('Error approving deletion request:', error);
        } finally {
            setApprovingId(null);
        }
    };

    const handleRejectDeletion = async (id) => {
        setRejectingId(id);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://127.0.0.1:8000/api/deletion-requests/${id}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDeletionRequests(deletionRequests.filter(request => request.id !== id));
        } catch (error) {
            console.error('Error rejecting deletion request:', error);
        } finally {
            setRejectingId(null);
        }
    };
    const handleApproveDeletionp = async (id) => {
        setApprovingId(id);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://127.0.0.1:8000/api/deletion-requestsp/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDeletionRequestsp(deletionRequestsp.filter(request => request.id !== id));
        } catch (error) {
            console.error('Error approving deletion request:', error);
        } finally {
            setApprovingId(null);
        }
    };

    const handleRejectDeletionp = async (id) => {
        setRejectingId(id);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://127.0.0.1:8000/api/deletion-requestsp/${id}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDeletionRequestsp(deletionRequestsp.filter(request => request.id !== id));
        } catch (error) {
            console.error('Error rejecting deletion request:', error);
        } finally {
            setRejectingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
                <p className="mt-4 text-lg font-semibold text-cyan-500">جاري تحميل الطلبات...</p>
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
                <div className="p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-cyan-700">الطلبات المعلقة</h2>
                    <Tabs>
                        <TabList className="flex space-x-4 mb-6 border-b border-gray-200">
                            <Tab className="px-4 py-2 cursor-pointer text-gray-500 hover:text-cyan-700 focus:ring-2 focus:ring-cyan-500" selectedClassName="text-cyan-700 border-b-2 border-cyan-500">
                                طلبات المرضى
                            </Tab>
                            <Tab className="px-4 py-2 cursor-pointer text-gray-500 hover:text-cyan-700 focus:ring-2 focus:ring-cyan-500" selectedClassName="text-cyan-700 border-b-2 border-cyan-500">
                                طلبات الأدوية
                            </Tab>
                            <Tab className="px-4 py-2 cursor-pointer text-gray-500 hover:text-cyan-700 focus:ring-2 focus:ring-cyan-500" selectedClassName="text-cyan-700 border-b-2 border-cyan-500">
                            طلبات تعديل دواء
                        </Tab>
                            <Tab className="px-4 py-2 cursor-pointer text-gray-500 hover:text-cyan-700 focus:ring-2 focus:ring-cyan-500" selectedClassName="text-cyan-700 border-b-2 border-cyan-500">
                                طلبات حذف دواء
                            </Tab>

                            <Tab className="px-4 py-2 cursor-pointer text-gray-500 hover:text-cyan-700 focus:ring-2 focus:ring-cyan-500" selectedClassName="text-cyan-700 border-b-2 border-cyan-500">
                                طلبات تعديل مريض
                            </Tab>
                            <Tab className="px-4 py-2 cursor-pointer text-gray-500 hover:text-cyan-700 focus:ring-2 focus:ring-cyan-500" selectedClassName="text-cyan-700 border-b-2 border-cyan-500">
                                طلبات حذف مريض
                            </Tab>
                        </TabList>

                        <TabPanel>
                            <h3 className="text-xl font-semibold mb-4 text-cyan-700">طلبات المرضى المعلقة</h3>
                            <ul className="space-y-4">
                                {requests.map((request) => (
                                    <li key={request.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-lg font-semibold text-gray-800">{request.name}</p>
                                                <p className="text-sm text-gray-500">{request.identity_number}</p>
                                            </div>
                                            <div className="space-x-2">
                                                <button
                                                    onClick={() => handleApprove(request.id, "patients")}
                                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                                    disabled={approvingId === request.id}
                                                >
                                                    {approvingId === request.id ? 'جاري القبول...' : 'موافقة'}
                                                </button>
                                                <button
                                                    onClick={() => handleReject(request.id, "patients")}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                                    disabled={rejectingId === request.id}
                                                >
                                                    {rejectingId === request.id ? 'جاري الرفض...' : 'رفض'}
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </TabPanel>

                        <TabPanel>
                            <h3 className="text-xl font-semibold mb-4 text-cyan-700">طلبات الأدوية المعلقة</h3>
                            <ul className="space-y-4">
                                {medRequests.map((medRequest) => (
                                    <li key={medRequest.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                                        <div className="flex justify-between items-center">
                                            <p className="text-lg font-semibold text-gray-800">{medRequest.name}</p>
                                            <div className="space-x-2">
                                                <button onClick={() => handleApprove(medRequest.id, "med")} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" disabled={approvingId === medRequest.id}>
                                                    {approvingId === medRequest.id ? 'جاري القبول...' : 'موافقة'}
                                                </button>
                                                <button onClick={() => handleReject(medRequest.id, "med")} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" disabled={rejectingId === medRequest.id}>
                                                    {rejectingId === medRequest.id ? 'جاري الرفض...' : 'رفض'}
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </TabPanel>
                        <TabPanel>
                            <h3 className="text-xl font-semibold mb-4 text-cyan-700">طلبات تعديل الأدوية</h3>

                        </TabPanel>
                        <TabPanel>
                            <h3 className="text-xl font-semibold mb-4 text-cyan-700">طلبات حذف الأدوية</h3>
                            <ul className="space-y-4">
                                {deletionRequests.map((deletionRequest) => (
                                    <li key={deletionRequest.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-lg font-semibold text-gray-800">{deletionRequest.medicine.name}</p>
                                                <p className="text-sm text-gray-500">طلب من: {deletionRequest.provider.name}</p>
                                            </div>
                                            <div className="space-x-2">
                                                <button
                                                    onClick={() => handleApproveDeletion(deletionRequest.id)}
                                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                                    disabled={approvingId === deletionRequest.id}
                                                >
                                                    {approvingId === deletionRequest.id ? 'جاري الموافقة...' : 'موافقة'}
                                                </button>
                                                <button
                                                    onClick={() => handleRejectDeletion(deletionRequest.id)}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                                    disabled={rejectingId === deletionRequest.id}
                                                >
                                                    {rejectingId === deletionRequest.id ? 'جاري الرفض...' : 'رفض'}
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </TabPanel>
                        <TabPanel>
                            <h3 className="text-xl font-semibold mb-4 text-cyan-700">طلبات تعديل المرضى</h3>

                        </TabPanel>
                        <TabPanel>
                            <h3 className="text-xl font-semibold mb-4 text-cyan-700">طلبات حذف المرضى</h3>
                            <ul className="space-y-4">
                                {deletionRequestsp.map((deletionRequestp) => (
                                    <li key={deletionRequestp.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-lg font-semibold text-gray-800">{deletionRequestp.patient.name}</p>
                                                <p className="text-sm text-gray-500">طلب من: {deletionRequestp.provider.name}</p>
                                            </div>
                                            <div className="space-x-2">
                                                <button
                                                    onClick={() => handleApproveDeletionp(deletionRequestp.id)}
                                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                                    disabled={approvingId === deletionRequestp.id}
                                                >
                                                    {approvingId === deletionRequestp.id ? 'جاري الموافقة...' : 'موافقة'}
                                                </button>
                                                <button
                                                    onClick={() => handleRejectDeletionp(deletionRequestp.id)}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                                    disabled={rejectingId === deletionRequestp.id}
                                                >
                                                    {rejectingId === deletionRequestp.id ? 'جاري الرفض...' : 'رفض'}
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </TabPanel>
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default PatientRequests;
