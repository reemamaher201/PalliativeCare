
import axios from "axios";


export const refreshToken = async () => {
    try {
        const response = await axios.post("http://127.0.0.1:8000/api/refresh-token", {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}` }
        });

        const newToken = response.data.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        if (localStorage.getItem("token")) {
            localStorage.setItem("token", newToken);
        } else {
            sessionStorage.setItem("token", newToken);
        }
    } catch (error) {
        console.error("Failed to refresh token:", error);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
    }
};


// تسجيل الخروج
export const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("rememberMe");
    window.location.href = "/login";
};
