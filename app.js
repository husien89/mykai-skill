const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const results = document.getElementById('results');
const qrBtn = document.getElementById('qrBtn');
const qrScanner = document.getElementById('qrScanner');
const closeScanner = document.getElementById('closeScanner');
const qrVideo = document.getElementById('qrVideo');
const csvInput = document.getElementById('csvInput');
const exportAllCsv = document.getElementById('exportAllCsv');

let videoStream = null;

// === البحث ===
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

// === عرض النتائج ===
function displayResults(data) {
    if (data.length === 0) {
        results.innerHTML = `<div class="no-result"><p>❌ لم يتم العثور على بيانات مطابقة</p></div>`;
        return;
    }
    results.innerHTML = data.map((person, index) => `
        <div class="card" id="card-${index}">
            <h3>✅ بيانات تم العثور عليها</h3>
            <div class="row"><span>الاسم الكامل:</span> <strong>${person.fullName}</strong></div>
            <div class="row"><span>الرقم الوطني:</span> <strong>${person.nationalNumber || '—'}</strong></div>
            <div class="row"><span>رقم البطاقة:</span> <strong>${person.idCard || '—'}</strong></div>
            <div class="row"><span>تاريخ الميلاد:</span> <strong>${person.birthDate || '—'}</strong></div>
            <div class="row"><span>العنوان:</span> <strong>${person.address || '—'}</strong></div>
            <div class="row"><span>الهاتف:</span> <strong>${person.phone || '—'}</strong></div>
            <div class="row"><span>الرقم الضريبي:</span> <strong>${person.taxNumber || '—'}</strong></div>
            <div class="row"><span>الجنسية:</span> <strong>${person.nationality || 'سوري'}</strong></div>
            
            <div class="qr-placeholder" id="qr-${index}"></div>
            
            <div class="actions">
                <button onclick="copyText('${person.fullName} — وطني: ${person.nationalNumber} — هاتف: ${person.phone || 'لا يوجد'}')">📋 نسخ</button>
                <button onclick="generateQR(${index}, '${JSON.stringify(person).replace(/'/g, "’")}')">📲 QR</button>
                <button onclick="exportToPDF('card-${index}')">📄 PDF</button>
            </div>
        </div>
    `).join('');
}

// === نسخ النص ===
function copyText(text) {
    navigator.clipboard.writeText(text);
    alert('✅ تم النسخ!');
}

// === توليد QR ===
function generateQR(index, dataStr) {
    try {
        const container = document.getElementById(`qr-${index}`);
        container.innerHTML = '';
        const person = JSON.parse(dataStr.replace(/’/g, "'"));
        const qrData = `${person.fullName} | وطني: ${person.nationalNumber} | هاتف: ${person.phone || 'لا يوجد'}`;
        QRCode.toCanvas(container, qrData, { width: 180, margin: 2, color: { dark: '#1e3c72', light: '#ffffff' } }, function (error) {
            if (error) { container.innerHTML = '<p>❌ خطأ في توليد QR</p>'; return; }
            container.style.padding = '15px';
            container.style.background = '#fff';
            container.style.borderRadius = '8px';
        });
    } catch (e) { alert('❌ خطأ في عرض البيانات'); }
}

// === تصدير PDF ===
function exportToPDF(cardId) {
    const element = document.getElementById(cardId);
    const opt = {
        margin: 15,
        filename: `بيانات_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save().then(() => alert('✅ تم حفظ PDF!'));
}

// === تصدير الكل إلى CSV ===
function exportAllToCSV() {
    if (!database || database.length === 0) { alert('❌ لا توجد بيانات'); return; }
    const headers = ['الاسم الكامل', 'اسم الأول', 'اسم الأب', 'اسم العائلة', 'الرقم الوطني', 'رقم البطاقة', 'تاريخ الميلاد', 'العنوان', 'الهاتف', 'الرقم الضريبي', 'الجنسية', 'الجنس'];
    const rows = database.map(p => [
        p.fullName, p.firstName, p.fatherName, p.lastName,
        p.nationalNumber, p.idCard || '', p.birthDate || '',
        p.address || '', p.phone || '', p.taxNumber || '', p.nationality || 'سوري', p.gender || ''
    ]);
    let csv = headers.join(',') + '\n' + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `قاعدة_البيانات_${new Date().toLocaleDateString('sv-SE')}.csv`;
    a.click(); URL.revokeObjectURL(url);
    alert('✅ تم تصدير الكل CSV!');
}

// === استيراد من CSV — يدعم name-dataset والتنسيق المحلي ===
csvInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
        const text = event.target.result;
        const lines = text.split('\n').filter(l => l.trim());
        if (lines.length < 2) { alert('❌ الملف فارغ'); return; }
        
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());
        const imported = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
            const clean = values.map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"'));
            
            // دعم تنسيق name-dataset: first_name,last_name,gender,country_code
            if (headers.includes('first_name') && headers.includes('last_name')) {
                const fnIdx = headers.indexOf('first_name');
                const lnIdx = headers.indexOf('last_name');
                const gIdx = headers.indexOf('gender');
                const ccIdx = headers.indexOf('country_code');
                
                // استيراد فقط السجلات السورية (SY)
                if (ccIdx !== -1 && clean[ccIdx].toUpperCase() !== 'SY') continue;
                
                imported.push({
                    id: Date.now() + i,
                    firstName: clean[fnIdx] || '',
                    fatherName: '',
                    lastName: clean[lnIdx] || '',
                    fullName: `${clean[fnIdx] || ''} ${clean[lnIdx] || ''}`.trim(),
                    nationalNumber: '',
                    idCard: '',
                    birthDate: '',
                    address: '',
                    phone: '',
                    taxNumber: '',
                    nationality: 'سوري',
                    gender: gIdx !== -1 ? (clean[gIdx] === 'M' ? 'ذكر' : clean[gIdx] === 'F' ? 'أنثى' : '') : ''
                });
            } else {
                // التنسيق المحلي
                imported.push({
                    id: Date.now() + i,
                    fullName: clean[0] || '',
                    firstName: clean[1] || '',
                    fatherName: clean[2] || '',
                    lastName: clean[3] || '',
                    nationalNumber: clean[4] || '',
                    idCard: clean[5] || '',
                    birthDate: clean[6] || '',
                    address: clean[7] || '',
                    phone: clean[8] || '',
                    taxNumber: clean[9] || '',
                    nationality: clean[10] || 'سوري',
                    gender: clean[11] || ''
                });
            }
        }
        
        if (imported.length > 0) {
            window.importedData = imported;
            alert(`✅ تم قراءة ${imported.length} سجل! أضف هذا الكود إلى data.js:\n\nconst database = ${JSON.stringify(imported, null, 2)}`);
            console.table(imported);
        } else {
            alert('⚠️ لم يتم العثور على سجلات سورية في الملف');
        }
    };
    reader.readAsText(file);
});

// === أحداث ===
exportAllCsv.addEventListener('click', exportAllToCSV);
searchBtn.addEventListener('click', () => searchData(searchInput.value));
searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && searchData(searchInput.value));

// === مسح QR ===
qrBtn.addEventListener('click', () => {
    qrScanner.style.display = 'block';
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
            qrVideo.srcObject = stream;
            videoStream = stream;
            alert('📷 الكاميرا جاهزة! ملاحظة: مسح QR الكامل يحتاج خادم HTTPS. يمكنك كتابة البيانات يدوياً.');
        })
        .catch(() => {
            alert('⚠️ لم يتم الوصول للكاميرا — استخدم البحث النصي');
            qrScanner.style.display = 'none';
        });
});

closeScanner.addEventListener('click', () => {
    if (videoStream) videoStream.getTracks().forEach(t => t.stop());
    qrScanner.style.display = 'none';
});
