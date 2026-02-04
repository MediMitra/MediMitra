package com.medimitra.service;

import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.medimitra.model.Order;
import com.medimitra.model.OrderItem;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class InvoicePdfGenerator {

    private static final Color PRIMARY_COLOR = new DeviceRgb(59, 130, 246);
    private static final Color SECONDARY_COLOR = new DeviceRgb(107, 114, 128);
    private static final Color ACCENT_COLOR = new DeviceRgb(16, 185, 129);
    private static final Color LIGHT_GRAY = new DeviceRgb(249, 250, 251);
    private static final Color DARK_GRAY = new DeviceRgb(31, 41, 55);

    public byte[] generateInvoicePdf(Order order) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Header Section
            addHeader(document);

            // Invoice Title
            addInvoiceTitle(document);

            // Order Details
            addOrderDetails(document, order);

            // Items Table
            addItemsTable(document, order);

            // Pricing Summary
            addPricingSummary(document, order);

            // Footer
            addFooter(document);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            log.error("Error generating PDF invoice for order {}: {}", order.getId(), e.getMessage());
            throw new RuntimeException("Failed to generate invoice PDF", e);
        }
    }

    private void addHeader(Document document) {
        Paragraph companyName = new Paragraph("MediMitra")
                .setFontSize(28)
                .setBold()
                .setFontColor(PRIMARY_COLOR)
                .setMarginBottom(5);
        document.add(companyName);

        Paragraph tagline = new Paragraph("Your Trusted Healthcare Partner")
                .setFontSize(10)
                .setFontColor(SECONDARY_COLOR)
                .setMarginBottom(2);
        document.add(tagline);

        Paragraph contact = new Paragraph("medi-mitra-omega.vercel.app | bisht.dheeraj2004c@gmail.com")
                .setFontSize(9)
                .setFontColor(SECONDARY_COLOR)
                .setMarginBottom(15);
        document.add(contact);
    }

    private void addInvoiceTitle(Document document) {
        Paragraph title = new Paragraph("INVOICE")
                .setFontSize(20)
                .setBold()
                .setFontColor(DARK_GRAY)
                .setTextAlignment(TextAlignment.RIGHT)
                .setMarginBottom(20);
        document.add(title);
    }

    private void addOrderDetails(Document document, Order order) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy");
        String formattedDate = order.getCreatedAt() != null 
            ? order.getCreatedAt().format(formatter) 
            : "N/A";

        // Create table for order details and address
        Table detailsTable = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
                .useAllAvailableWidth()
                .setBorder(Border.NO_BORDER);

        // Left Column - Order Info
        Paragraph orderInfo = new Paragraph()
                .add(new Paragraph("Order Details:").setBold().setFontColor(SECONDARY_COLOR).setFontSize(11))
                .add(new Paragraph("\nInvoice #: INV-" + String.format("%06d", order.getId())).setFontSize(10))
                .add(new Paragraph("Order ID: #" + order.getId()).setFontSize(10))
                .add(new Paragraph("Date: " + formattedDate).setFontSize(10))
                .add(new Paragraph("Status: " + order.getStatus().toString()).setFontSize(10));

        if (order.getPaymentMethod() != null) {
            orderInfo.add(new Paragraph("Payment: " + order.getPaymentMethod()).setFontSize(10));
        }

        Cell leftCell = new Cell()
                .add(orderInfo)
                .setBorder(Border.NO_BORDER)
                .setPaddingRight(10);

        // Right Column - Delivery Address
        Paragraph addressInfo = new Paragraph()
                .add(new Paragraph("Delivery Address:").setBold().setFontColor(SECONDARY_COLOR).setFontSize(11))
                .setTextAlignment(TextAlignment.RIGHT);

        if (order.getAddress() != null) {
            if (order.getUser() != null && order.getUser().getName() != null) {
                addressInfo.add(new Paragraph(order.getUser().getName()).setFontSize(10));
            }
            if (order.getAddress().getAddressLine1() != null) {
                addressInfo.add(new Paragraph(order.getAddress().getAddressLine1()).setFontSize(10));
            }
            String cityState = order.getAddress().getCity() + ", " + order.getAddress().getState();
            if (order.getAddress().getZipCode() != null) {
                cityState += " - " + order.getAddress().getZipCode();
            }
            addressInfo.add(new Paragraph(cityState).setFontSize(10));
            if (order.getUser() != null && order.getUser().getPhone() != null) {
                addressInfo.add(new Paragraph("Phone: " + order.getUser().getPhone()).setFontSize(10));
            }
        }

        Cell rightCell = new Cell()
                .add(addressInfo)
                .setBorder(Border.NO_BORDER)
                .setPaddingLeft(10);

        detailsTable.addCell(leftCell);
        detailsTable.addCell(rightCell);

        document.add(detailsTable);
        document.add(new Paragraph("\n"));
    }

    private void addItemsTable(Document document, Order order) {
        Table itemsTable = new Table(UnitValue.createPercentArray(new float[]{50f, 15f, 17.5f, 17.5f}))
                .useAllAvailableWidth();

        // Table Header
        itemsTable.addHeaderCell(createHeaderCell("Medicine Name"));
        itemsTable.addHeaderCell(createHeaderCell("Qty"));
        itemsTable.addHeaderCell(createHeaderCell("Price"));
        itemsTable.addHeaderCell(createHeaderCell("Total"));

        // Table Rows
        boolean alternate = false;
        for (OrderItem item : order.getItems()) {
            BigDecimal itemTotal = item.getPrice().multiply(new BigDecimal(item.getQuantity()));
            
            Color bgColor = alternate ? LIGHT_GRAY : com.itextpdf.kernel.colors.ColorConstants.WHITE;
            
            itemsTable.addCell(createDataCell(item.getMedicine().getName(), bgColor));
            itemsTable.addCell(createDataCell(String.valueOf(item.getQuantity()), bgColor));
            itemsTable.addCell(createDataCell("₹" + item.getPrice().toString(), bgColor));
            itemsTable.addCell(createDataCell("₹" + itemTotal.toString(), bgColor));
            
            alternate = !alternate;
        }

        document.add(itemsTable);
        document.add(new Paragraph("\n"));
    }

    private void addPricingSummary(Document document, Order order) {
        BigDecimal subtotal = order.getItems().stream()
                .map(item -> item.getPrice().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal tax = subtotal.multiply(new BigDecimal("0.05"));
        BigDecimal shipping = subtotal.compareTo(new BigDecimal("200")) >= 0 
                ? BigDecimal.ZERO 
                : new BigDecimal("50");

        Table summaryTable = new Table(UnitValue.createPercentArray(new float[]{70, 30}))
                .useAllAvailableWidth()
                .setBorder(Border.NO_BORDER);

        // Subtotal
        summaryTable.addCell(createSummaryCell("Subtotal:", false));
        summaryTable.addCell(createSummaryCell("₹" + subtotal.toString(), true));

        // Tax
        summaryTable.addCell(createSummaryCell("Tax (5%):", false));
        summaryTable.addCell(createSummaryCell("₹" + tax.toString(), true));

        // Shipping
        summaryTable.addCell(createSummaryCell("Shipping:", false));
        if (shipping.compareTo(BigDecimal.ZERO) == 0) {
            Cell freeCell = createSummaryCell("FREE", true)
                    .setFontColor(ACCENT_COLOR)
                    .setBold();
            summaryTable.addCell(freeCell);
        } else {
            summaryTable.addCell(createSummaryCell("₹" + shipping.toString(), true));
        }

        // Total
        Cell totalLabel = new Cell()
                .add(new Paragraph("Total Amount:").setBold().setFontSize(12))
                .setBorder(new SolidBorder(SECONDARY_COLOR, 1))
                .setBorderTop(Border.NO_BORDER)
                .setBorderLeft(Border.NO_BORDER)
                .setBorderRight(Border.NO_BORDER)
                .setPaddingTop(10)
                .setPaddingBottom(5)
                .setTextAlignment(TextAlignment.LEFT);

        Cell totalAmount = new Cell()
                .add(new Paragraph("₹" + order.getTotalAmount().toString()).setBold().setFontSize(14).setFontColor(ACCENT_COLOR))
                .setBorder(new SolidBorder(SECONDARY_COLOR, 1))
                .setBorderTop(Border.NO_BORDER)
                .setBorderLeft(Border.NO_BORDER)
                .setBorderRight(Border.NO_BORDER)
                .setPaddingTop(10)
                .setPaddingBottom(5)
                .setTextAlignment(TextAlignment.RIGHT);

        summaryTable.addCell(totalLabel);
        summaryTable.addCell(totalAmount);

        document.add(summaryTable);
        document.add(new Paragraph("\n"));
    }

    private void addFooter(Document document) {
        Paragraph thanks = new Paragraph("Thank you for choosing MediMitra for your healthcare needs!")
                .setFontSize(9)
                .setItalic()
                .setFontColor(SECONDARY_COLOR)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20);
        document.add(thanks);

        Paragraph generated = new Paragraph("This is a computer-generated invoice and does not require a signature.")
                .setFontSize(8)
                .setFontColor(SECONDARY_COLOR)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(generated);

        Paragraph contact = new Paragraph("For any queries, contact us at bisht.dheeraj2004c@gmail.com or call +91-9389788529")
                .setFontSize(8)
                .setFontColor(SECONDARY_COLOR)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(contact);
    }

    private Cell createHeaderCell(String text) {
        return new Cell()
                .add(new Paragraph(text).setBold().setFontSize(10).setFontColor(com.itextpdf.kernel.colors.ColorConstants.WHITE))
                .setBackgroundColor(PRIMARY_COLOR)
                .setTextAlignment(TextAlignment.CENTER)
                .setPadding(8);
    }

    private Cell createDataCell(String text, Color backgroundColor) {
        return new Cell()
                .add(new Paragraph(text).setFontSize(10))
                .setBackgroundColor(backgroundColor)
                .setBorder(Border.NO_BORDER)
                .setPadding(6);
    }

    private Cell createSummaryCell(String text, boolean rightAlign) {
        Cell cell = new Cell()
                .add(new Paragraph(text).setFontSize(10))
                .setBorder(Border.NO_BORDER)
                .setPaddingTop(5)
                .setPaddingBottom(5);
        
        if (rightAlign) {
            cell.setTextAlignment(TextAlignment.RIGHT);
        } else {
            cell.setTextAlignment(TextAlignment.LEFT);
        }
        
        return cell;
    }
}
