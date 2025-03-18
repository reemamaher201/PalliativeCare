// src/services/auth.js
import axios from 'axios';
import {useEffect} from "react";

// دالة لتجديد الـ Token
export const refreshToken = async () => {
    try {
        const response = await axios.post("http://127.0.0.1:8000/api/refresh-token", {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        localStorage.setItem("token", response.data.token);
    } catch (error) {
        console.error("Failed to refresh token:", error);
        logout();
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const interval = setInterval(refreshToken, 14 * 60 * 1000); // تجديد الـ Token كل 14 دقيقة
            return () => clearInterval(interval);
        }
    }, []);
};



// دالة لتسجيل الخروج
export const logout = () => {
    localStorage.removeItem('token');
    // إعادة توجيه المستخدم لصفحة تسجيل الدخول
    window.location.href = '/login';
};