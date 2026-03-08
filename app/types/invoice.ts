/**
 * Invoice TypeScript Types
 *
 * Defines all types related to invoice generation.
 */

import type { Customer, OrderItem, CustomerType } from "./order";

// Invoice status
export type InvoiceStatus = "draft" | "issued" | "paid" | "cancelled";

// Seller (company) information
export interface SellerInfo {
  name: string;
  address: string;
  city: string;
  taxNumber: string; // Tax number
  bankAccount: string; // Bank account number
  email: string;
  phone: string;
  logoUrl?: string; // Optional logo URL
}

// Invoice line item
export interface InvoiceItem {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

// Invoice data structure
export interface Invoice {
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  seller: SellerInfo;
  customer: Customer;
  items: InvoiceItem[];
  subtotal: number;
  vatRate: number; // VAT rate as decimal (e.g., 0.27 for 27%)
  vatAmount: number;
  total: number;
  status: InvoiceStatus;
  notes?: string;
}

// Invoice request for generating from order
export interface InvoiceRequest {
  orderItems: OrderItem[];
  customer: Customer;
  invoiceNumber: string;
  issueDate?: Date;
  dueDate?: Date;
}

// Formatted invoice data for display
export interface InvoiceFormData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  customerType: CustomerType;
  customerName: string;
  customerEmail: string;
  customerTaxNumber?: string;
  customerAddress?: string;
  customerBankAccount?: string;
  items: InvoiceItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
}
