import React from "react";
import { FaCommentDots } from "react-icons/fa";

const ChatButton = () => {
    return (
        <button
            className="fixed bottom-6 left-6 bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-full shadow-lg transition duration-300"
            onClick={() => alert("فتح الدردشة!")}
        >
            <FaCommentDots size={24} />
        </button>
    );
};

export default ChatButton;