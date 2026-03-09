import { NextRequest, NextResponse } from "next/server";
import type { OrderRequest, OrderResponse, Customer } from "../../types/order";
import { createInvoiceFromOrder } from "../../utils/invoice-generator";
import { generateInvoicePDFBase64 } from "../../utils/pdf-generator";
import { sendOrderConfirmationEmail, sendSellerNotificationEmail } from "../../utils/email-sender";

/**
 * POST /api/order
 *
 * Processes an order and sends email with invoice.
 *
 * Request body:
 * {
 *   items: OrderItem[],
 *   customer: Customer
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   message: string,
 *   orderId?: string,
 *   emailSent?: boolean
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body: OrderRequest = await request.json();

    // Validate request
    if (!body.items || !body.customer) {
      return NextResponse.json(
        { success: false, message: "Missing data!" },
        { status: 400 },
      );
    }

    // Validate items
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "No product selected!" },
        { status: 400 },
      );
    }

    // Validate customer
    if (!body.customer.name || !body.customer.email) {
      return NextResponse.json(
        { success: false, message: "Missing customer data!" },
        { status: 400 },
      );
    }

    // Validate company-specific fields if company
    if (body.customer.type === "company") {
      const company = body.customer as Customer & { type: "company" };
      if (!company.taxNumber || !company.bankAccount || !company.address) {
        return NextResponse.json(
          { success: false, message: "Missing company data!" },
          { status: 400 },
        );
      }
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Calculate total
    const total = body.items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);

    // Generate invoice from order
    const invoice = createInvoiceFromOrder(body.items, body.customer);

    // Generate PDF as base64
    const pdfBase64 = await generateInvoicePDFBase64(invoice);

    console.log("Order received:", {
      orderId,
      invoiceNumber: invoice.invoiceNumber,
      items: body.items,
      customer: body.customer,
      total,
      pdfGenerated: true,
    });

    // Send email with PDF attachment
    let emailSent = false;
    let emailError = "";

    try {
      const emailResult = await sendOrderConfirmationEmail(
        body.customer.email,
        body.customer.name,
        invoice,
        pdfBase64,
      );

      if (emailResult.success) {
        emailSent = true;
        console.log("Email sent successfully:", emailResult.messageId);
      } else {
        emailError = emailResult.error || "Unknown email error";
        console.error("Email sending failed:", emailError);
      }
    } catch (emailErr) {
      emailError = emailErr instanceof Error ? emailErr.message : "Email exception";
      console.error("Email exception:", emailError);
    }

    // Send notification email to seller
    try {
      const customerAny = body.customer as unknown as {
        type: string;
        address?: string;
        taxNumber?: string;
        phone?: string;
      };
      
      const customerAddress = customerAny.type === "company"
        ? `${customerAny.address || ""}, ${customerAny.taxNumber || ""}`
        : customerAny.address || "N/A";

      const sellerResult = await sendSellerNotificationEmail(
        body.customer.name,
        body.customer.email,
        customerAny.phone || "N/A",
        customerAddress,
        invoice,
        pdfBase64,
      );

      if (sellerResult.success) {
        console.log("Seller notification email sent:", sellerResult.messageId);
      } else {
        console.error("Seller notification email failed:", sellerResult.error);
      }
    } catch (sellerEmailErr) {
      console.error("Seller email exception:", sellerEmailErr);
    }

    const response: OrderResponse = {
      success: true,
      message: emailSent
        ? "Order processed successfully! We have sent the invoice via email."
        : "Order processed successfully! (Email sending failed)",
      orderId,
      emailSent,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Order processing error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your order!",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/order
 *
 * Health check endpoint.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Order API is running",
  });
}
