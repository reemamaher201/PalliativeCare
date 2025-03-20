import React from "react";
import { FaCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ChatButton = () => {
    const navigate = useNavigate();

    const handleChatButtonClick = () => {
        navigate("/chat"); // ينقل المستخدم إلى صفحة الدردشة
    };

    return (
        <button
            className="fixed bottom-6 left-6 bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-full shadow-lg transition duration-300"
            onClick={handleChatButtonClick}
        >
            <FaCommentDots size={24} />
        </button>
    );
};

export default ChatButton;
