/**
 * PDF Generator Utility
 *
 * Generates PDF blobs from invoice data.
 */

import { pdf } from "@react-pdf/renderer";
import type { Invoice } from "../types/invoice";
import { InvoiceDocument } from "../components/invoice/InvoiceDocument";
import { companyInfo } from "../data/company";

// Generate PDF blob from invoice
export async function generateInvoicePDF(
  invoice: Invoice,
  logoUrl?: string,
): Promise<Blob> {
  const document = InvoiceDocument({ invoice, logoUrl: logoUrl || companyInfo.logoUrl });
  const blob = await pdf(document).toBlob();
  return blob;
}

// Generate PDF as base64 string
export async function generateInvoicePDFBase64(
  invoice: Invoice,
  logoUrl?: string,
): Promise<string> {
  const blob = await generateInvoicePDF(invoice, logoUrl);
  const arrayBuffer = await blob.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return base64;
}

// Generate PDF and return as ArrayBuffer
export async function generateInvoicePDFBuffer(
  invoice: Invoice,
  logoUrl?: string,
): Promise<ArrayBuffer> {
  const document = InvoiceDocument({ invoice, logoUrl: logoUrl || companyInfo.logoUrl });
  const blob = await pdf(document).toBlob();
  return blob.arrayBuffer();
}

export default {
  generateInvoicePDF,
  generateInvoicePDFBase64,
  generateInvoicePDFBuffer,
};
