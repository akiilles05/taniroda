/**
 * Invoice Generator Utility
 *
 * Creates invoice data from order information.
 */

import type { OrderItem, Customer } from "../types/order";
import type { Invoice, InvoiceItem, InvoiceRequest } from "../types/invoice";
import { companyInfo, DEFAULT_VAT_RATE, DEFAULT_PAYMENT_DEADLINE_DAYS, generateInvoiceNumber } from "../data/company";

// Map product unit to English
const unitTranslations: Record<string, string> = {
  rental: "rental",
  night: "night",
  person: "person",
  hour: "hour",
  package: "package",
};

// Format unit in English
function formatUnit(unit: string): string {
  return unitTranslations[unit] || unit;
}

// Generate invoice from order
export function generateInvoice(request: InvoiceRequest): Invoice {
  const issueDate = request.issueDate || new Date();
  const dueDate = request.dueDate || new Date(Date.now() + DEFAULT_PAYMENT_DEADLINE_DAYS * 24 * 60 * 60 * 1000);

  // Convert order items to invoice items
  const invoiceItems: InvoiceItem[] = request.orderItems
    .filter((item) => item.product && item.quantity > 0)
    .map((item) => {
      const product = item.product!;
      return {
        id: item.id,
        productName: product.name,
        quantity: item.quantity,
        unit: formatUnit(product.unit),
        unitPrice: product.price,
        totalPrice: product.price * item.quantity,
      };
    });

  // Calculate totals
  const subtotal = invoiceItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const vatAmount = subtotal * DEFAULT_VAT_RATE;
  const total = subtotal + vatAmount;

  // Build customer name and address based on type
  let customerName = "";
  let customerAddress = "";
  let customerTaxNumber = "";
  let customerBankAccount = "";

  if (request.customer.type === "company") {
    customerName = request.customer.name;
    customerAddress = request.customer.address || "";
    customerTaxNumber = request.customer.taxNumber;
    customerBankAccount = request.customer.bankAccount;
  } else {
    customerName = request.customer.name;
  }

  return {
    invoiceNumber: request.invoiceNumber,
    issueDate,
    dueDate,
    seller: companyInfo,
    customer: request.customer,
    items: invoiceItems,
    subtotal,
    vatRate: DEFAULT_VAT_RATE,
    vatAmount,
    total,
    status: "issued",
    notes: undefined,
  };
}

// Generate a new invoice with auto-generated number
export function createInvoiceFromOrder(
  orderItems: OrderItem[],
  customer: Customer,
): Invoice {
  const invoiceNumber = generateInvoiceNumber();
  
  return generateInvoice({
    orderItems,
    customer,
    invoiceNumber,
  });
}

// Generate invoice with custom number
export function createInvoiceFromOrderWithNumber(
  orderItems: OrderItem[],
  customer: Customer,
  invoiceNumber: string,
  issueDate?: Date,
  dueDate?: Date,
): Invoice {
  return generateInvoice({
    orderItems,
    customer,
    invoiceNumber,
    issueDate,
    dueDate,
  });
}

export default {
  generateInvoice,
  createInvoiceFromOrder,
  createInvoiceFromOrderWithNumber,
};
