import React, { useState } from "react";
import Header from "./comp/Header.jsx";
import Sidebar from "./comp/Sidebar.jsx";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // استيراد useNavigate

const AddMedicine = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        distributed_quantity: 0,
        required_quantity: 0,
        locations: "",
        next_distribution_date: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate(); // استخدام useNavigate

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:8000/api/storemedicine", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setMessage(response.data.message);
            setError("");
            setFormData({
                name: "",
                description: "",
                distributed_quantity: 0,
                required_quantity: 0,
                locations: "",
                next_distribution_date: "",
            });

            // بعد النجاح، انتقل إلى واجهة عرض الأدوية
            // navigate('/showmediciens'); // استبدل '/medicines' بالمسار الصحيح لواجهة عرض الأدوية
        } catch (error) {
            console.error("Error adding medicine:", error);
            if (error.response) {
                console.log("Response data:", error.response.data);
                setError(error.response.data.message);
            } else if (error.request) {
                setError("لم يتم استلام أي استجابة من الخادم.");
            } else {
                setError("حدث خطأ أثناء إعداد الطلب.");
            }
            setMessage("");
        }
    };

    return (
        <div dir="rtl" className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex flex-col flex-grow ">
                <div className="font-sans">
                    <Header />
                </div>
                <section>
                    <h3 className="text-lg font-bold text-cyan-700 m-6 ">إضافة دواء جديد</h3>

                    {message && <div className="bg-green-200 text-green-800 p-3 rounded-md">{message}</div>}
                    {error && <div className="bg-red-200 text-red-800 p-3 rounded-md">{error}</div>}

                    <form className="space-y-4 px-8" onSubmit={handleSubmit}>
                        <div>
                            <input
                                type="text"
                                placeholder="اسم الدواء"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="موصوف لمرضى"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                type="number"
                                placeholder="الكمية الموزعة"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                name="distributed_quantity"
                                value={formData.distributed_quantity}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                type="number"
                                placeholder="الكمية المطلوبة"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                name="required_quantity"
                                value={formData.required_quantity}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <textarea
                                placeholder="أماكن التواجد"
                                rows="3"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                name="locations"
                                value={formData.locations}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <div>
                            <label className="flex justify-start">التوزيع القادم</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                name="next_distribution_date"
                                value={formData.next_distribution_date}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="bg-cyan-700 text-white px-6 py-2 rounded-lg hover:bg-cyan-800 transition"
                            >
                                إضافة
                            </button>
                        </div>
                    </form>
                </section>
                </main>
</div>
);
};

export default AddMedicine;