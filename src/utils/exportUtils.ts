import * as XLSX from 'xlsx';

/**
 * Enterprise Excel Export Utility with Persian UTF-8 Support
 */
export function exportToExcel(data: Record<string, any>[], fileName: string, sheetName: string = 'گزارش آپتوس'): void {
  if (!data || data.length === 0) {
    alert('داده‌ای برای خروجی اکسل یافت نشد.');
    return;
  }

  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Auto-calculate column widths
    const colWidths = Object.keys(data[0] || {}).map((key) => {
      const maxLen = Math.max(
        key.toString().length,
        ...data.map((row) => (row[key] ? row[key].toString().length : 0))
      );
      return { wch: Math.min(Math.max(maxLen + 4, 12), 40) };
    });
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Trigger download
    const finalFileName = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;
    XLSX.writeFile(workbook, finalFileName);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    // Fallback CSV download with UTF-8 BOM
    exportToCsv(data, fileName);
  }
}

/**
 * Fallback CSV Exporter with Persian UTF-8 BOM
 */
export function exportToCsv(data: Record<string, any>[], fileName: string): void {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  data.forEach((row) => {
    const values = headers.map((header) => {
      const val = row[header] ?? '';
      const escaped = ('' + val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  });

  const csvContent = '\uFEFF' + csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', fileName.endsWith('.csv') ? fileName : `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Enterprise Persian PDF / Printable Document Utility
 * Formats data with official Aptus Iran letterhead, date/time stamp, and clean RTL typography
 */
export function exportToPdf(
  title: string,
  headers: string[],
  rows: (string | number)[][],
  fileName: string = 'Aptus_Report'
): void {
  let printWindow: Window | null = null;
  try {
    printWindow = window.open('', '_blank');
  } catch {
    printWindow = null;
  }
  if (!printWindow) {
    alert('پنجره چاپ مسدود گردید. لطفاً مجوز پاپ‌آپ مرورگر را فعال کنید.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const headerHtml = headers.map((h) => `<th style="padding: 10px 12px; background-color: #032b75; color: #ffffff; font-size: 11px; font-weight: bold; border: 1px solid #1e3a8a; text-align: right;">${h}</th>`).join('');

  const rowsHtml = rows
    .map(
      (row, idx) => `
      <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        ${row
          .map(
            (cell) =>
              `<td style="padding: 8px 12px; font-size: 11px; border: 1px solid #e2e8f0; color: #1e293b; text-align: right;">${cell ?? '-'}</td>`
          )
          .join('')}
      </tr>
    `
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
      <meta charset="utf-8" />
      <title>${title} - شرکت ساختمانی آپتوس ایران</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700;800&display=swap');
        body {
          font-family: 'Vazirmatn', 'B Nazanin', Tahoma, sans-serif;
          margin: 0;
          padding: 24px;
          color: #0f172a;
          background: #ffffff;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>
      <!-- Header Banner -->
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #f05a24; padding-bottom: 12px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="background: #032b75; color: #ffffff; font-weight: 900; padding: 6px 14px; border-radius: 8px; font-size: 14px;">
            APTUS
          </div>
          <div>
            <h1 style="margin: 0; font-size: 16px; font-weight: 800; color: #032b75;">شرکت ساختمانی آپتوس ایران</h1>
            <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">سامانه جامع مدیریت منابع سازمانی (Aptus Ai ERP)</p>
          </div>
        </div>
        <div style="text-align: left; font-size: 10px; color: #475569;">
          <div><strong>تاریخ صدور:</strong> ${currentDate}</div>
          <div><strong>زمان:</strong> ${currentTime}</div>
          <div><strong>شناسه گزارش:</strong> APT-${Math.floor(100000 + Math.random() * 900000)}</div>
        </div>
      </div>

      <!-- Report Title -->
      <div style="margin-bottom: 16px; background-color: #f1f5f9; padding: 10px 14px; border-radius: 8px; border-right: 4px solid #f05a24;">
        <h2 style="margin: 0; font-size: 14px; color: #0f172a; font-weight: 700;">${title}</h2>
      </div>

      <!-- Data Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr>${headerHtml}</tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <!-- Footer Summary Stamp -->
      <div style="margin-top: 30px; border-top: 1px dashed #cbd5e1; padding-top: 12px; display: flex; justify-content: space-between; font-size: 10px; color: #64748b;">
        <div>تعداد کل رکوردها: <strong>${rows.length} سطر</strong></div>
        <div>مدیریت ارشد پروژه: <strong>آقای محسن واحدی</strong></div>
        <div>این سند الکترونیکی و صادرشده از سامانه هوشمند آپتوس ایران می‌باشد.</div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
