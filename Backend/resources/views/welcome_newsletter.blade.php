<!DOCTYPE html>
<html>
<head>
    <title>مرحبًا بك في موقع وزارة الصحة الخاصة بمرضى الرعاية التلطيفية</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f0f8ff; /* لون خلفية أزرق فاتح */
            padding: 20px;
            margin: 0;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            border: 1px solid #e0e0e0;
        }
        h1 {
            color: #3193a5; /* لون أزرق سماوي */
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #34aec6;
            padding-bottom: 10px;
        }
        p {
            font-size: 16px;
            text-align: center;
            margin-bottom: 25px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            color: #777;
            border-top: 1px solid #e0e0e0;
            padding-top: 20px;
        }
        .button {
            display: inline-block;
            background-color: #34aec6; /* لون أزرق سماوي */
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            text-decoration: none;
            margin-top: 30px;
            text-align: center;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #56aabc; /* لون أزرق سماوي أفتح عند التحويم */
        }
        .icon {
            width: 24px;
            height: 24px;
            margin-right: 8px;
            vertical-align: middle;
        }
    </style>
</head>
<body>
<div class="container">
    <h1>مرحبًا {{ $subscriber->email  }}!</h1>
    <p>شكرًا لاشتراكك في نشرة الأخبار الخاصة بنا. نحن متحمسون لوجودك معنا!</p>
    <p>لتكون دائمًا على اطلاع بكل ما هو جديد، يمكنك زيارة موقعنا أو متابعة قنواتنا على وسائل التواصل الاجتماعي.</p>
    <a href="http://localhost:5173/" class="button">اذهب إلى موقعنا</a>
    <div class="footer">
        <p>إذا كان لديك أي استفسارات، فلا تتردد في التواصل معنا.</p>
        <p>فريق دعم العملاء</p>
    </div>
</div>
</body>
</html>
