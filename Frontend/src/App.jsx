
import './App.css'
import RouterComponent from "./router.jsx";
import { refreshToken } from './services/Auth/auth.jsx';
import {useEffect} from "react";


function App() {
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // تجديد الـ Token كل 14 دقيقة (قبل انتهاء صلاحيته بـ 1 دقيقة)
            const interval = setInterval(refreshToken, 14 * 60 * 1000);
            return () => clearInterval(interval); // تنظيف الفاصل الزمني عند إلغاء المكون
        }
    }, []);

  return(
      <div>
        <RouterComponent/>
      </div>
  );
}

export default App
