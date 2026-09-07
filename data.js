/**
 * 📂 قاعدة البيانات — نظام البحث والتحقق السوري
 * الإصدار: 2.1.0 | التحديث: 7 أيلول 2026
 * 
 * 📝 طريقة الإضافة: انسخ الكائن أدناه وعدّل البيانات
 * 📥 استيراد من CSV: استخدم زر "استيراد" في التطبيق
 * 🌐 مصادر الأسماء: name-dataset (SY.csv) + Forebears + OSINT Syria
 */

const database = [
    {
        id: 1,
        firstName: "حسين",
        fatherName: "أحمد",
        lastName: "الفارس",
        fullName: "حسين أحمد الفارس",
        nationalNumber: "111080065381",
        idCard: "1234567890",
        birthDate: "01/01/1989",
        address: "الرقة — تل أبيض",
        phone: "+963932304537",
        taxNumber: "111080065381",
        nationality: "سوري",
        gender: "ذكر"
    },
    {
        id: 2,
        firstName: "معتز",
        fatherName: "محمد",
        lastName: "الفارس",
        fullName: "معتز محمد الفارس",
        nationalNumber: "111080065382",
        idCard: "1234567891",
        birthDate: "15/05/1992",
        address: "الرقة — مركز المدينة",
        phone: "+963932304538",
        taxNumber: "111080065382",
        nationality: "سوري",
        gender: "ذكر"
    },
    {
        id: 3,
        firstName: "سامر",
        fatherName: "علي",
        lastName: "الحسن",
        fullName: "سامر علي الحسن",
        nationalNumber: "110012345678",
        idCard: "1122334455",
        birthDate: "10/03/1985",
        address: "دمشق — الميدان",
        phone: "+963955123456",
        taxNumber: "110012345678",
        nationality: "سوري",
        gender: "ذكر"
    }
    // ✅ أضف المزيد بنفس التنسيق
    // 💡 أو استورد من ملف name-dataset: SY.csv عبر زر الاستيراد
];

/**
 * 🌐 دليل استيراد بيانات name-dataset:
 * 1. قم بتنزيل المشروع: https://github.com/philipperemy/name-dataset
 * 2. استخرج الملف: data/SY.csv (سوريا)
 * 3. استخدم زر "استيراد CSV" في التطبيق
 * 4. سيتم تحويل الأعمدة تلقائياً: first_name → firstName, last_name → lastName
 */
