/**
 * Company Information
 *
 * Contains seller/company details for invoices.
 */

import type { SellerInfo } from "../types/invoice";

export const companyInfo: SellerInfo = {
  name: "Elite Affairs Kft.",
  address: "Bisinger József sétány 32.",
  city: "9022 Győr",
  taxNumber: "85869694-2-08",
  bankAccount: "20526615-67760512-00000000",
  email: "elite.affairs.kft@gmail.com",
  phone: "+36 30 910 1300",
  logoUrl: undefined, // Add your logo URL here (e.g., "/logo.png" or "https://.
  // 
  // 
  // 
  // ..")
};

// Default VAT rate in Hungary (27%)
export const DEFAULT_VAT_RATE = 0.27;

// Default payment deadline in days
export const DEFAULT_PAYMENT_DEADLINE_DAYS = 8;

// Format currency for display
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

// Format date for display
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

// Generate invoice number
let invoiceCounter = 1000;

export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  invoiceCounter++;
  return `EA/${year}/${invoiceCounter}`;
}
