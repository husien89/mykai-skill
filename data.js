// =====================================================
// ✅ 1️⃣ ضع الكود الجديد هنا في البداية — قبل كل شيء
// =====================================================

// === تحميل بيانات الأسماء السورية من ملف CSV خارجي ===
async function loadSyrianNamesCSV() {
    try {
        const csvUrl = 'https://raw.githubusercontent.com/philipperemy/name-dataset/main/data/SY.csv';
        
        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error('فشل تحميل الملف');
        
        const csvText = await response.text();
        const lines = csvText.split('\n');
        
        const importedNames = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length < 2) continue;
            
            importedNames.push({
                id: Date.now() + i,
                firstName: values[0]?.trim() || '',
                fatherName: '',
                lastName: values[1]?.trim() || '',
                fullName: `${values[0]?.trim() || ''} ${values[1]?.trim() || ''}`.trim(),
                nationalNumber: '',
                idCard: '',
                birthDate: '',
                address: '',
                phone: '',
                taxNumber: '',
                nationality: 'سوري',
                gender: values[2] === 'M' ? 'ذكر' : values[2] === 'F' ? 'أنثى' : ''
            });
            
            if (importedNames.length >= 5000) break;
        }
        
        window.importedNames = importedNames;
        console.log(`✅ تم تحميل ${importedNames.length} اسم سوري`);
        return importedNames;
        
    } catch (error) {
        console.log('⚠️ تعذر تحميل الملف الخارجي، استخدم البيانات المحلية');
        return [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadSyrianNamesCSV().then(names => {
        if (names.length > 0 && typeof database !== 'undefined') {
            database.push(...names);
            console.log(`✅ إجمالي البيانات: ${database.length} سجل`);
        }
    });
});

// =====================================================
// ✅ 2️⃣ باقي الكود الأصلي يأتي هنا في الأسفل
// =====================================================

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const results = document.getElementById('results');
const qrBtn = document.getElementById('qrBtn');
const qrScanner = document.getElementById('qrScanner');
const closeScanner = document.getElementById('closeScanner');
const qrVideo = document.getElementById('qrVideo');
const csvInput = document.getElementById('csvInput');
const exportAllCsv = document.getElementById('exportAllCsv');

// === باقي الدوال والكود الأصلي هنا ===

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
