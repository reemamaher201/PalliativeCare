import React, { useState } from "react";
import Modal from "react-modal";

const EditPatientModal = ({ patient, isOpen, onRequestClose, onSave }) => {
    const [formData, setFormData] = useState(patient || {}); // تأكد من أن patient ليس null

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Edit Patient">
            <h2>تعديل بيانات المريض</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    الاسم:
                    <input
                        type="text"
                        name="name"
                        value={formData.name || ""} // تأكد من أن القيمة ليست null
                        onChange={handleChange}
                    />
                </label>
                <label>
                    رقم الهوية:
                    <input
                        type="text"
                        name="identity_number"
                        value={formData.identity_number || ""} // تأكد من أن القيمة ليست null
                        onChange={handleChange}
                    />
                </label>
                <label>
                    رقم الجوال:
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber || ""} // تأكد من أن القيمة ليست null
                        onChange={handleChange}
                    />
                </label>
                <label>
                    العنوان:
                    <input
                        type="text"
                        name="address"
                        value={formData.address || ""} // تأكد من أن القيمة ليست null
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">حفظ</button>
                <button type="button" onClick={onRequestClose}>إلغاء</button>
            </form>
        </Modal>
    );
};

export default EditPatientModal;