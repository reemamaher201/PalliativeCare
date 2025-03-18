import React, { useState, useEffect } from "react";

const EditMedicineModal = ({ medicine, isOpen, onRequestClose, onSave }) => {
    const [formData, setFormData] = useState(medicine || {}); // التأكد من أنه إذا كان medicine فارغًا، نستخدم كائن فارغ

    useEffect(() => {
        if (medicine) {
            setFormData(medicine);
        }
    }, [medicine]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSave(formData);
        onRequestClose(); // إغلاق المودال بعد الإرسال
    };

    // إذا كان المودال غير مفتوح أو لا يوجد دواء، لا نقوم بعرضه
    if (!isOpen || !medicine) return null;

    return (
        <div dir="rtl" className="fixed inset-0 bg-black/30 backdrop-blur-lg backdrop-brightness-75 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold text-cyan-700 mb-4">تعديل الدواء</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">اسم الدواء</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">التصنيف</label>
                        <input
                            type="text"
                            name="type"
                            value={formData.type || ''}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">الوصف</label>
                        <textarea
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            rows="3"
                        ></textarea>
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

export default EditMedicineModal;
