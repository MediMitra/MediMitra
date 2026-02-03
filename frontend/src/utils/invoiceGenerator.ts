import jsPDF from 'jspdf';

interface InvoiceItem {
  name?: string;
  medicineName?: string;
  medicine?: {
    name?: string;
    price?: number;
  };
  quantity: number;
  price: number;
}

interface InvoiceAddress {
  fullName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  street?: string;
  city: string;
  state: string;
  zipCode?: string;
  postalCode?: string;
}

interface InvoiceData {
  id: number;
  createdAt?: string;
  date?: string;
  totalAmount: number;
  items: InvoiceItem[];
  address?: InvoiceAddress;
  paymentMethod?: string;
  status?: string;
}

export const generateInvoice = (order: InvoiceData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Colors
  const primaryColor: [number, number, number] = [59, 130, 246]; // Blue
  const secondaryColor: [number, number, number] = [107, 114, 128]; // Gray
  const accentColor: [number, number, number] = [16, 185, 129]; // Green
  
  // Header Background
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Company Logo/Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('MediMitra', 15, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Your Trusted Healthcare Partner', 15, 28);
  doc.text('medi-mitra-omega.vercel.app | bisht.dheeraj2004c@gmail.com', 15, 35);
  
  // Invoice Title
  doc.setFillColor(243, 244, 246);
  doc.rect(0, 45, pageWidth, 15, 'F');
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth - 15, 55, { align: 'right' });
  
  // Order Details Section
  let yPos = 70;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Left Column - Order Info
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...secondaryColor);
  doc.text('Order Details:', 15, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`Invoice #: INV-${order.id.toString().padStart(6, '0')}`, 15, yPos);
  
  yPos += 6;
  doc.text(`Order ID: #${order.id}`, 15, yPos);
  
  yPos += 6;
  const orderDate = order.createdAt || order.date;
  const formattedDate = orderDate 
    ? new Date(orderDate).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    : 'N/A';
  doc.text(`Date: ${formattedDate}`, 15, yPos);
  
  yPos += 6;
  const status = (order.status || 'Processing').charAt(0).toUpperCase() + 
                 (order.status || 'Processing').slice(1).toLowerCase();
  doc.text(`Status: ${status}`, 15, yPos);
  
  if (order.paymentMethod) {
    yPos += 6;
    doc.text(`Payment: ${order.paymentMethod}`, 15, yPos);
  }
  
  // Right Column - Customer Info
  yPos = 70;
  if (order.address) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...secondaryColor);
    doc.text('Delivery Address:', pageWidth - 15, yPos, { align: 'right' });
    
    yPos += 7;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    if (order.address.fullName) {
      doc.text(order.address.fullName, pageWidth - 15, yPos, { align: 'right' });
      yPos += 6;
    }
    
    const addressLine1 = order.address.addressLine1 || order.address.street;
    if (addressLine1) {
      doc.text(addressLine1, pageWidth - 15, yPos, { align: 'right' });
      yPos += 6;
    }
    
    if (order.address.addressLine2) {
      doc.text(order.address.addressLine2, pageWidth - 15, yPos, { align: 'right' });
      yPos += 6;
    }
    
    const postalCode = order.address.zipCode || order.address.postalCode;
    const cityState = `${order.address.city}, ${order.address.state}${postalCode ? ' - ' + postalCode : ''}`;
    doc.text(cityState, pageWidth - 15, yPos, { align: 'right' });
    yPos += 6;
    
    if (order.address.phone) {
      doc.text(`Phone: ${order.address.phone}`, pageWidth - 15, yPos, { align: 'right' });
      yPos += 6;
    }
  }
  
  // Items Table
  yPos = Math.max(yPos, 130);
  
  // Table Header
  doc.setFillColor(...primaryColor);
  doc.rect(15, yPos, pageWidth - 30, 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Medicine Name', 20, yPos + 7);
  doc.text('Qty', pageWidth - 80, yPos + 7);
  doc.text('Price', pageWidth - 55, yPos + 7);
  doc.text('Total', pageWidth - 25, yPos + 7, { align: 'right' });
  
  yPos += 10;
  
  // Table Rows
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  
  const items = order.items || [];
  let subtotal = 0;
  
  items.forEach((item, index) => {
    const itemName = item.medicineName || item.name || item.medicine?.name || 'Medicine';
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    // Alternate row background
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(15, yPos, pageWidth - 30, 8, 'F');
    }
    
    doc.text(itemName, 20, yPos + 6);
    doc.text(item.quantity.toString(), pageWidth - 80, yPos + 6);
    doc.text(`₹${item.price.toFixed(2)}`, pageWidth - 55, yPos + 6);
    doc.text(`₹${itemTotal.toFixed(2)}`, pageWidth - 25, yPos + 6, { align: 'right' });
    
    yPos += 8;
  });
  
  // Divider line
  yPos += 5;
  doc.setDrawColor(...secondaryColor);
  doc.setLineWidth(0.5);
  doc.line(15, yPos, pageWidth - 15, yPos);
  
  // Pricing Summary
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  
  // Subtotal
  doc.text('Subtotal:', pageWidth - 80, yPos);
  doc.text(`₹${subtotal.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' });
  
  yPos += 7;
  // Tax (5%)
  const tax = subtotal * 0.05;
  doc.text('Tax (5%):', pageWidth - 80, yPos);
  doc.text(`₹${tax.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' });
  
  yPos += 7;
  // Shipping
  const shipping = subtotal > 0 && subtotal < 200 ? 50 : 0;
  doc.text('Shipping:', pageWidth - 80, yPos);
  if (shipping === 0 && subtotal >= 200) {
    doc.setTextColor(...accentColor);
    doc.setFont('helvetica', 'bold');
    doc.text('FREE', pageWidth - 25, yPos, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
  } else {
    doc.text(`₹${shipping.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' });
  }
  
  yPos += 2;
  doc.setLineWidth(0.5);
  doc.line(pageWidth - 85, yPos, pageWidth - 15, yPos);
  
  // Total
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total Amount:', pageWidth - 80, yPos);
  doc.setTextColor(...accentColor);
  doc.setFontSize(14);
  doc.text(`₹${order.totalAmount.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' });
  
  // Footer
  doc.setTextColor(...secondaryColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  const footerY = pageHeight - 25;
  doc.text('Thank you for choosing MediMitra for your healthcare needs!', pageWidth / 2, footerY, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('This is a computer-generated invoice and does not require a signature.', pageWidth / 2, footerY + 5, { align: 'center' });
  doc.text('For any queries, contact us at bisht.dheeraj2004c@gmail.com or call +91-9389788529', pageWidth / 2, footerY + 10, { align: 'center' });
  
  // Border
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1);
  doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
  
  // Save the PDF
  const fileName = `MediMitra_Invoice_${order.id}_${new Date().getTime()}.pdf`;
  doc.save(fileName);
};
