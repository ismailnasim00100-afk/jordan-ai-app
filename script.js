// ========================================
// JORDAN AI - Main JavaScript
// ========================================

// التمرير إلى مولد المحتوى
function scrollToGenerator() {
    const generator = document.getElementById("generator");

    if (generator) {
        generator.scrollIntoView({
            behavior: "smooth"
        });
    }
}


// ========================================
// مولد المحتوى - النسخة التجريبية
// ========================================

function generateDemo() {

    const input = document
        .getElementById("productInput")
        .value
        .trim();

    const result = document.getElementById("result");
    const resultText = document.getElementById("resultText");

    if (!input) {
        alert("اكتب تفاصيل المنتج أو الخدمة أولاً 🇯🇴");
        return;
    }

    // إظهار النتيجة
    result.classList.add("show");

    resultText.innerHTML = `
        <strong>🔥 إعلانك جاهز!</strong>
        <br><br>

        ✨ ${input}
        <br><br>

        🚀 لا تفوّت الفرصة!
        <br>
        اكتشف عرضنا المميز واستمتع بتجربة تجمع
        بين الجودة والسعر الرائع.
        <br><br>

        📍 اطلب الآن واستفد من العرض قبل انتهائه!
        <br><br>

        🇯🇴 بواسطة <strong>JORDAN AI</strong>
    `;

    // الانتقال للنتيجة
    result.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// ========================================
// أزرار أنواع المحتوى
// ========================================

const tabs = document.querySelectorAll(".tab");

tabs.forEach(function(tab) {

    tab.addEventListener("click", function() {

        tabs.forEach(function(item) {
            item.classList.remove("active");
        });

        tab.classList.add("active");

        const input = document.getElementById("productInput");

        if (tab.textContent.includes("وصف")) {

            input.placeholder =
                "اكتب اسم المنتج ومميزاته وسعره...";

        } else if (tab.textContent.includes("سوشيال")) {

            input.placeholder =
                "اكتب معلومات المنتج أو الخدمة التي تريد نشرها...";

        } else if (tab.textContent.includes("أفكار")) {

            input.placeholder =
                "اكتب مجال مشروعك وسنقترح لك أفكارًا إبداعية...";

        } else {

            input.placeholder =
                "مثال: لدي مطعم يقدم برغر لحم طازج مع بطاطا، ولدينا عرض خاص اليوم بسعر 3 دنانير...";

        }

    });

});


// ========================================
// تأثير بسيط عند تحميل الصفحة
// ========================================

document.addEventListener("DOMContentLoaded", function() {

    console.log("🇯🇴 JORDAN AI Started Successfully");

});
