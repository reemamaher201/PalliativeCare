import React, { useState, useEffect } from "react";

const EditPatientModal = ({ patient, isOpen, onRequestClose, onSave }) => {
    const [formData, setFormData] = useState(patient||{});

    useEffect(() => {
        if (patient) {
            setFormData(patient);
        }
    }, [patient]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSave(formData);
        onRequestClose(); // Close modal after saving
    };

    if (!isOpen || !patient) return null;

    return (
        <div dir="rtl" className="fixed inset-0 bg-black/30 backdrop-blur-lg backdrop-brightness-75 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                <h2 className="text-xl font-bold text-cyan-700 mb-4">تعديل بيانات المريض</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">الاسم</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name} // Directly use value due to controlled component
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">رقم الهوية</label>
                        <input
                            type="text"
                            name="identity_number"
                            value={formData.identity_number}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">رقم الجوال</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">العنوان</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onRequestClose}
                            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="bg-cyan-500 text-white py-2 px-4 rounded-lg hover:bg-cyan-600"
                        >
                            حفظ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPatientModal;