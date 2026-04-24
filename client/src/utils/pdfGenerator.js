import jsPDF from 'jspdf';
import 'jspdf-autotable';

const BRAND = {
  name: 'StaySync',
  tagline: 'Smart PG Management',
  primaryColor: [99, 102, 241], // Indigo
  secondaryColor: [100, 116, 139], // Surface-500
  accentColor: [16, 185, 129], // Emerald
};

/**
 * Create a branded PDF document with header and footer.
 */
function createDoc(title, orientation = 'portrait') {
  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });

  // Header bar
  doc.setFillColor(...BRAND.primaryColor);
  doc.rect(0, 0, doc.internal.pageSize.width, 28, 'F');

  // Brand name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(BRAND.name, 14, 14);

  // Document title
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(title, 14, 22);

  // Date
  doc.setFontSize(8);
  doc.text(
    `Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`,
    doc.internal.pageSize.width - 14,
    22,
    { align: 'right' }
  );

  // Reset colors
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);

  return doc;
}

/**
 * Add footer to all pages.
 */
function addFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');

    doc.setFontSize(7);
    doc.setTextColor(...BRAND.secondaryColor);
    doc.text(`${BRAND.name} — ${BRAND.tagline}`, 14, pageHeight - 5);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 5, { align: 'right' });
  }
}

/**
 * Generate a rent receipt PDF.
 */
export function generateRentReceipt(payment) {
  const doc = createDoc('Rent Receipt');

  let y = 38;

  // Receipt box
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, y, doc.internal.pageSize.width - 28, 85, 3, 3);

  y += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Receipt', 24, y);

  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const details = [
    ['Tenant', payment.residentName || 'N/A'],
    ['Property', payment.propertyName || 'N/A'],
    ['Room', payment.roomNumber || 'N/A'],
    ['Billing Month', payment.billingMonth || 'N/A'],
    ['Amount', `₹${(payment.amount || 0).toLocaleString('en-IN')}`],
    ['Late Fee', `₹${(payment.lateFeeAmount || 0).toLocaleString('en-IN')}`],
    ['Total Paid', `₹${(payment.paidAmount || payment.amount || 0).toLocaleString('en-IN')}`],
    ['Payment Method', (payment.paymentMethod || 'N/A').toUpperCase()],
    ['Transaction ID', payment.transactionId || 'N/A'],
    ['Status', (payment.status || 'N/A').toUpperCase()],
    ['Paid Date', payment.paidDate ? new Date(payment.paidDate).toLocaleDateString('en-IN') : 'N/A'],
  ];

  details.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BRAND.secondaryColor);
    doc.text(label, 24, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(String(value), 80, y);
    y += 6;
  });

  addFooter(doc);
  doc.save(`receipt-${payment.billingMonth || 'payment'}.pdf`);
}

/**
 * Generate an occupancy summary PDF.
 */
export function generateOccupancyReport(properties) {
  const doc = createDoc('Occupancy Report');

  doc.autoTable({
    startY: 36,
    head: [['Property', 'Total Rooms', 'Occupied', 'Vacant', 'Rate']],
    body: properties.map((p) => [
      p.name,
      p.total,
      p.occupied,
      p.vacant,
      `${p.rate}%`,
    ]),
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: BRAND.primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
  });

  addFooter(doc);
  doc.save('occupancy-report.pdf');
}

/**
 * Generate an audit log export PDF.
 */
export function generateAuditReport(logs) {
  const doc = createDoc('Audit Trail Report', 'landscape');

  doc.autoTable({
    startY: 36,
    head: [['Date', 'Action', 'Performed By', 'Role', 'Target', 'Details']],
    body: logs.map((log) => [
      new Date(log.createdAt).toLocaleString('en-IN'),
      log.action,
      log.performedByName,
      log.performedByRole,
      log.targetUserName || log.targetResource || '—',
      typeof log.details === 'object' ? JSON.stringify(log.details).slice(0, 60) : String(log.details || '—'),
    ]),
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: BRAND.primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 10, right: 10 },
    columnStyles: {
      5: { cellWidth: 50 },
    },
  });

  addFooter(doc);
  doc.save('audit-report.pdf');
}

/**
 * Generate a payment summary report.
 */
export function generatePaymentReport(payments, title = 'Payment Report') {
  const doc = createDoc(title);

  doc.autoTable({
    startY: 36,
    head: [['Tenant', 'Room', 'Amount', 'Due Date', 'Status', 'Paid']],
    body: payments.map((p) => [
      p.resident?.name || p.residentName || 'N/A',
      p.room?.roomNumber || p.roomNumber || 'N/A',
      `₹${(p.amount || 0).toLocaleString('en-IN')}`,
      p.dueDate ? new Date(p.dueDate).toLocaleDateString('en-IN') : 'N/A',
      (p.status || '').toUpperCase(),
      `₹${(p.paidAmount || 0).toLocaleString('en-IN')}`,
    ]),
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: BRAND.primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
  });

  addFooter(doc);
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}
