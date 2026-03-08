/**
 * Email Sender Utility
 *
 * Sends emails with PDF invoice attachments using nodemailer.
 */

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import type { Invoice } from "../types/invoice";
import { companyInfo } from "../data/company";

// Email configuration - can be set via environment variables
const emailConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
};

// Create transporter
let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport(emailConfig);
  }
  return transporter;
}

// Email sending result
export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Send order confirmation email with invoice
export async function sendOrderConfirmationEmail(
  customerEmail: string,
  customerName: string,
  invoice: Invoice,
  pdfBase64: string,
): Promise<EmailResult> {
  try {
    const transport = getTransporter();

    // Format dates for email
    const issueDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(invoice.issueDate);

    const dueDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(invoice.dueDate);

    // Format total
    const totalFormatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(invoice.total);

    // Build items list for email
    const itemsList = invoice.items
      .map(
        (item) =>
          `- ${item.productName}: ${item.quantity} ${item.unit} × ${new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(item.unitPrice)} = ${new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(item.totalPrice)}`,
      )
      .join("\n");

    // Email HTML body
    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #1a1a1a; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .invoice-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
    .items { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
    .items pre { margin: 0; white-space: pre-wrap; }
    .total { font-size: 18px; font-weight: bold; color: #1a1a1a; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Confirmation</h1>
      <p>Thank you for your order!</p>
    </div>
    <div class="content">
      <p>Dear <strong>${customerName}</strong>!</p>
      <p>We have received your order. Please find the invoice attached.</p>
      
      <div class="invoice-info">
        <h3>Invoice Details</h3>
        <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
        <p><strong>Issue Date:</strong> ${issueDate}</p>
        <p><strong>Due Date:</strong> ${dueDate}</p>
      </div>
      
      <div class="items">
        <h3>Ordered Products</h3>
        <pre>${itemsList}</pre>
      </div>
      
      <p class="total">Total: ${totalFormatted} (incl. VAT)</p>
      
      <p><strong>Payment Information:</strong></p>
      <p>Bank Account: ${invoice.seller.bankAccount}</p>
      <p>Reference: ${invoice.invoiceNumber}</p>
      
      <p>If you have any questions, please contact us at info@eliteaffairs.hu.</p>
      
      <p>Best regards,<br><strong>Elite Affairs Team</strong></p>
    </div>
    <div class="footer">
      <p>Elite Affairs Kft. | ${companyInfo.address}, ${companyInfo.city}</p>
      <p>Email: ${companyInfo.email} | Tel: ${companyInfo.phone}</p>
    </div>
  </div>
</body>
</html>
    `;

    // Plain text version
    const textBody = `
Order Confirmation
Thank you for your order!

Dear ${customerName}!

We have received your order. Please find the invoice attached.

Invoice Details:
- Invoice Number: ${invoice.invoiceNumber}
- Issue Date: ${issueDate}
- Due Date: ${dueDate}

Ordered Products:
${itemsList}

Total: ${totalFormatted} (incl. VAT)

Payment Information:
- Bank Account: ${invoice.seller.bankAccount}
- Reference: ${invoice.invoiceNumber}

If you have any questions, please contact us at info@eliteaffairs.hu.

Best regards,
Elite Affairs Team
    `;

    // Send email
    const info = await transport.sendMail({
      from: `"Elite Affairs" <${emailConfig.auth.user}>`,
      to: customerEmail,
      subject: `Order Confirmation - ${invoice.invoiceNumber}`,
      text: textBody,
      html: htmlBody,
      attachments: [
        {
          filename: `invoice-${invoice.invoiceNumber}.pdf`,
          content: pdfBase64,
          encoding: "base64",
          contentType: "application/pdf",
        },
      ],
    });

    console.log("Email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export default {
  sendOrderConfirmationEmail,
};
