import './App.css'
import RouterComponent from "./router.jsx";
import { refreshToken } from './services/Auth/auth.jsx';
import { useEffect } from "react";

function App() {
    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            // 🔄 تجديد التوكن كل 14 دقيقة (قبل انتهائه بدقيقة)
            const interval = setInterval(refreshToken, 14 * 60 * 1000);
            return () => clearInterval(interval);
        }
    }, []);

    return (
        <div>
            <RouterComponent />
        </div>
    );
}

export default App;
