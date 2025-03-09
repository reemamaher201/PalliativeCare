import React from "react";
import PNavbar from "./PNavbar.jsx";

const GeneralAdvice = () => {
    return (
        <div dir= " rtl" className="bg-white max-h-screen">
            {/* شريط التنقل */}
            <div className="font-sans">
                <PNavbar/>
            </div>
            <div  className=" p-8">
                <div className="container mx-auto">
                    {/* العنوان الرئيسي */}
                    <h2 className="text-cyan-700 text-2xl font-bold text-center mb-4">
                        نصائح عامة
                    </h2>
                    <h3 className="text-gray-700 text-lg font-bold text-center mb-8">
                        كيفية التعامل مع الألم
                    </h3>

                    {/* البطاقات */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* البطاقة الأولى */}
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h4 className="text-cyan-700 text-lg font-bold mb-4">
                                طرق تخفيف الألم
                            </h4>
                            <p dir= " rtl" className="text-gray-700 mb-4">
                                : إليكم بعض الحلول والطرق الفعالة لتخفيف الألم وتسكينه والسيطرة عليه
                            </p>
                            <ul dir= " rtl" className="list-decimal list-inside text-gray-700 space-y-2">
                                <li>
                                    <span  className="font-bold">الأنشطة الجسدية والرياضات الخفيفة:</span> للأنشطة
                                    اليومية المعتدلة (مثل المشي والسباحة واليوغا) أن تخفف من بعض
                                    الآلام بشكل ملحوظ وتسبب إفرازات التوتر المسببة للراحة.
                                </li>
                                <li>
                                    أنشطة جسدية تساعد على تقليل الألم عبر شد الجسم والعضلات
                                    والمرونة.
                                </li>
                            </ul>
                            <a
                                href="#"
                                className="text-cyan-700 font-bold hover:underline mt-4 inline-block"
                            >
                                اقرأ المزيد
                            </a>
                        </div>

                        {/* البطاقة الثانية */}
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h4 className="text-cyan-700 text-lg font-bold mb-4">
                                YouTube and Vimeo...
                            </h4>
                            <div className="relative mb-4">
                                <iframe className="w-full h-40 rounded-lg"
                                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                        title="YouTube video"
                                        allowFullScreen
                                ></iframe>
                            </div>
                            <p dir={"rtl"} className="text-gray-700">
                                "الألم الجسدي ممكن يكون تحدي كبير في حياتنا اليومية، سواء كان بسبب إصابة، مرض مزمن، أو حتى إجهاد. في هذا الفيديو، رح نحكي عن استراتيجيات فعالة للتعامل مع الألم بطرق علمية ونفسية. حنشرح أهمية التنفس العميق وتقنيات الاسترخاء لتخفيف التوتر، وكيفية استخدام الكمادات الباردة أو الساخنة بناءً على نوع الألم. كمان، حنتكلم عن أهمية الحركة البسيطة والتمارين لتخفيف الألم وتقوية الجسم. "تذكر، الألم جزء من الحياة، لكن طريقتك في التعامل معه هي اللي بتحدد قوتك."
                            </p>
                            <p className="text-gray-700 mt-2">
                                "ذكر الألم جزء من الرحلة. أكل خضرواتك هي التي تحدد قوتك."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" min-h-screen p-8">
      <div className="container mx-auto">
                {/* العنوان الرئيسي */}
                <h2 className="text-cyan-700 text-2xl font-bold text-center mb-8">
          برنامج غذائي يمكن اتباعه بشكل يومي
        </h2>

 {/* البطاقات */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {/* البطاقة الأولى */}
                    <div className="bg-white shadow-lg rounded-lg p-10">
            <h3 className="text-cyan-700 text-lg font-bold mb-4">
                        أهداف البرنامج الغذائي
                    </h3>
                    <ul className="list-decimal list-inside text-gray-700 space-y-2">
              <li>توفيرذية الكافية لتعزيز الطاقة والراحة.</li>
             <li>تخف الأعراض المرتبطة بالغذاء، مثل الغثيان أو عسر الهضم.</li>
             <li>تحسين الحياة من خلال تناول وجبات مغذية ومتوازنة.</li>
           </ul>
         </div>

 {/* البطاقة الثانية */}
          <div className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-cyan-700 text-lg font-bold mb-4">
              الإفطار (خفيف وسهل الهضم)
            </h3>
           <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>كوب الشوفان المطبوخ مع الحليب قليل الدسم ومهروس الموز.</li>
                            <li>
                                ريحة خبز محمص مع ملعقة صغيرة من زبدة الفول السوداني أو الجبن الطري.
                            </li>
                            <li>
                                عصير فواكه طبيعي (مثل التفاح أو الجزر) بدون إضافات.
                            </li>
                    </ul>
            </div>

            {/* البطاقة الثالثة */}
            <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-cyan-700 text-lg font-bold mb-4">
                البدائل لمن يعانون من الغثيان
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>بوري البطاطا الحلوة أو الموز الناضج.</li>
             <li>مشروبافئ مثل شاي الزنجبيل.</li>
           </ul>
         </div>

 {/* البطاقة الرابعة */}
          <div className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-cyan-700 text-lg font-bold mb-4">
              الغداء (وجبة رئيسية متوازنة)
            </h3>
           <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>برو خفيف:</li>
                    <ul className="list-disc list-inside ml-4">
                <li>صدرجاج مشوي أو سمك مشوي (مثل السلمون أو البلطي).</li>
               <li>عدسهو أو فول مهروس.</li>
             </ul>
             <li>خضرو مطهية:</li>
             <ul className="list-disc list-inside ml-4">
                        <li>كوس، جزر، أو بطاطس مسلوقة.</li>
                    </ul>
                    <li>كربيدرات سهلة الهضم:</li>
                    <ul className="list-disc list-inside ml-4">
                <li>أرز أو بطاطس مشوية.</li>
             </ul>
           </ul>
         </div>

 {/* البطاقة الخامسة */}
          <div className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-cyan-700 text-lg font-bold mb-4">
              العشاء (وجبة خفيفة)
            </h3>
           <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>شور العدس أو الخضار المهروسة.</li>
                            <li>شريحةز من الحبوب الكاملة.</li>
                            <li>كوببادي قليل الدسم.</li>
                    </ul>
        </div>
</div>
</div>
</div>


        </div>
    );
};

export default GeneralAdvice;