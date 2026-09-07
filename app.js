const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const results = document.getElementById('results');

// دالة البحث الرئيسية
function searchData(query) {
    query = query.trim().toLowerCase();
    if (!query) {
        results.innerHTML = `<div class="empty-state"><p>أدخل كلمة البحث أولاً</p></div>`;
        return;
    }

    const matches = database.filter(person => 
        person.fullName.toLowerCase().includes(query) ||
        person.nationalNumber.includes(query) ||
        person.firstName.toLowerCase().includes(query) ||
        person.lastName.toLowerCase().includes(query)
    );

    displayResults(matches);
}

// عرض النتائج
function displayResults(data) {
    if (data.length === 0) {
        results.innerHTML = `<div class="no-result"><p>❌ لم يتم العثور على بيانات مطابقة</p></div>`;
        return;
    }

    results.innerHTML = data.map(person => `
        <div class="card">
            <h3>✅ بيانات تم العثور عليها</h3>
            <div class="row"><span>الاسم الكامل:</span> <strong>${person.fullName}</strong></div>
            <div class="row"><span>الرقم الوطني:</span> <strong>${person.nationalNumber}</strong></div>
            <div class="row"><span>رقم البطاقة:</span> <strong>${person.idCard}</strong></div>
            <div class="row"><span>تاريخ الميلاد:</span> <strong>${person.birthDate}</strong></div>
            <div class="row"><span>العنوان:</span> <strong>${person.address}</strong></div>
            <div class="row"><span>الهاتف:</span> <strong>${person.phone}</strong></div>
            <div class="row"><span>الرقم الضريبي:</span> <strong>${person.taxNumber}</strong></div>
            <div class="row"><span>الجنسية:</span> <strong>${person.nationality}</strong></div>
            <div class="actions">
                <button onclick="copyText('${person.fullName} — ${person.nationalNumber}')">📋 نسخ</button>
                <button onclick="window.print()">🖨️ طباعة</button>
            </div>
        </div>
    `).join('');
}

// نسخ النص
function copyText(text) {
    navigator.clipboard.writeText(text);
    alert('✅ تم النسخ!');
}

// أحداث البحث
searchBtn.addEventListener('click', () => searchData(searchInput.value));
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchData(searchInput.value);
});
