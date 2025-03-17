import React from 'react';
import gifUrl from '../../assets/404.gif'
import {Link} from "react-router-dom";
const NotFound = () => {

    const randomParam = `?v=${Date.now()}`; // إضافة معلمة عشوائية

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <h1 className="text-center text-black font-bold "  style={{ fontSize: '2em' }}>الصفحة غير موجودة</h1>
            <img src={`${gifUrl}${randomParam}`} alt="404 not found" />
            <Link to="/" style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#3193a5', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                العودة إلى الصفحة الرئيسية
            </Link>
        </div>
    );
};

export default NotFound;