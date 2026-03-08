/**
 * Invoice PDF Document
 *
 * Creates a professional invoice PDF using @react-pdf/renderer.
 * Supports international characters and includes educational disclaimer.
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import type { Invoice, InvoiceItem } from "../../types/invoice";


// Styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  // Header with logo
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 25,
  },
  logoContainer: {
    width: 120,
    height: 60,
    marginBottom: 10,
  },
  logo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 5,
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#444",
  },
  datesContainer: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  dateRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  dateLabel: {
    width: 100,
    color: "#666",
  },
  dateValue: {
    fontWeight: "bold",
  },

  // Sections
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  // Addresses
  addressesContainer: {
    flexDirection: "row",
    marginBottom: 25,
  },
  addressBox: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f9f9f9",
    marginRight: 10,
    borderRadius: 4,
  },
  addressBoxLast: {
    marginRight: 0,
  },
  addressLabel: {
    fontSize: 9,
    color: "#888",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  addressName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 3,
  },
  addressDetail: {
    color: "#444",
    lineHeight: 1.5,
  },

  // Table
  table: {
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderTopWidth: 2,
    borderTopColor: "#333",
  },
  tableHeaderCell: {
    fontWeight: "bold",
    fontSize: 9,
    color: "#333",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableCell: {
    color: "#444",
  },
  colNumber: { width: 30 },
  colName: { width: 200 },
  colQty: { width: 50, textAlign: "right" },
  colUnit: { width: 50, textAlign: "center" },
  colPrice: { width: 70, textAlign: "right" },
  colTotal: { width: 80, textAlign: "right" },

  // Totals
  totalsContainer: {
    alignItems: "flex-end",
    marginTop: 10,
    marginBottom: 30,
  },
  totalsRow: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  totalsLabel: {
    color: "#666",
  },
  totalsValue: {
    fontWeight: "bold",
  },
  totalsRowTotal: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 2,
    borderTopColor: "#333",
    marginTop: 5,
  },
  totalsLabelTotal: {
    fontSize: 12,
    fontWeight: "bold",
  },
  totalsValueTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a1a1a",
  },

  // Payment info
  paymentSection: {
    marginBottom: 20,
  },
  paymentRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  paymentLabel: {
    width: 120,
    color: "#666",
  },
  paymentValue: {
    fontWeight: "bold",
    color: "#333",
  },

  // Disclaimer
  disclaimerSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff3cd",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ffc107",
  },
  disclaimerTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 5,
  },
  disclaimerText: {
    fontSize: 9,
    color: "#856404",
    lineHeight: 1.5,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerCol: {
    fontSize: 8,
    color: "#888",
  },
  footerNote: {
    marginTop: 5,
    fontSize: 8,
    color: "#999",
  },
});

// Helper to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Helper to format date
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

// Invoice Document Component
interface InvoiceDocumentProps {
  invoice: Invoice;
  logoUrl?: string;
}

export function InvoiceDocument({ invoice, logoUrl }: InvoiceDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            {logoUrl && (
              <View style={styles.logoContainer}>
                <Image src={logoUrl} style={styles.logo} />
              </View>
            )}
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.datesContainer}>
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>Issue Date:</Text>
                <Text style={styles.dateValue}>{formatDate(invoice.issueDate)}</Text>
              </View>
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>Due Date:</Text>
                <Text style={styles.dateValue}>{formatDate(invoice.dueDate)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Seller & Buyer */}
        <View style={styles.addressesContainer}>
          <View style={styles.addressBox}>
            <Text style={styles.addressLabel}>SELLER</Text>
            <Text style={styles.addressName}>{invoice.seller.name}</Text>
            <Text style={styles.addressDetail}>
              {invoice.seller.address}
              {"\n"}
              {invoice.seller.city}
              {"\n"}
              Adószám: {invoice.seller.taxNumber}
              {"\n"}
              Email: {invoice.seller.email}
            </Text>
          </View>
          <View style={[styles.addressBox, styles.addressBoxLast]}>
            <Text style={styles.addressLabel}>CUSTOMER</Text>
            <Text style={styles.addressName}>
              {invoice.customer.type === "company"
                ? invoice.customer.name
                : invoice.customer.name}
            </Text>
            <Text style={styles.addressDetail}>
              {invoice.customer.type === "company" &&
                invoice.customer.address &&
                `${invoice.customer.address}\n`}
              {invoice.customer.type === "company" &&
                invoice.customer.taxNumber &&
                `Tax Number: ${invoice.customer.taxNumber}\n`}
              Email: {invoice.customer.email}
              {invoice.customer.type === "company" &&
                invoice.customer.bankAccount &&
                `\nBank Account: ${invoice.customer.bankAccount}`}
            </Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colNumber]}>#</Text>
            <Text style={[styles.tableHeaderCell, styles.colName]}>Description</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.colUnit]}>Unit</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>Unit Price</Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>Amount</Text>
          </View>
          {invoice.items.map((item: InvoiceItem, index: number) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colNumber]}>{index + 1}</Text>
              <Text style={[styles.tableCell, styles.colName]}>{item.productName}</Text>
              <Text style={[styles.tableCell, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.colUnit]}>{item.unit}</Text>
              <Text style={[styles.tableCell, styles.colPrice]}>
                {formatCurrency(item.unitPrice)}
              </Text>
              <Text style={[styles.tableCell, styles.colTotal]}>
                {formatCurrency(item.totalPrice)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal:</Text>
            <Text style={styles.totalsValue}>{formatCurrency(invoice.subtotal)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>VAT ({(invoice.vatRate * 100).toFixed(0)}%):</Text>
            <Text style={styles.totalsValue}>{formatCurrency(invoice.vatAmount)}</Text>
          </View>
          <View style={styles.totalsRowTotal}>
            <Text style={styles.totalsLabelTotal}>TOTAL:</Text>
            <Text style={styles.totalsValueTotal}>{formatCurrency(invoice.total)}</Text>
          </View>
        </View>

        {/* Payment Information */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>PAYMENT INFORMATION</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Bank Account:</Text>
            <Text style={styles.paymentValue}>{invoice.seller.bankAccount}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Reference:</Text>
            <Text style={styles.paymentValue}>{invoice.invoiceNumber}</Text>
          </View>
        </View>

        {/* Educational Disclaimer */}
        <View style={styles.disclaimerSection}>
          <Text style={styles.disclaimerTitle}>IMPORTANT NOTICE</Text>
          <Text style={styles.disclaimerText}>
            This invoice has been created for EDUCATIONAL PURPOSES ONLY. 
            The company Elite Affairs Kft. is a FICTITIOUS company that does not exist 
            and is not a registered business. This document CANNOT be claimed as 
            an expense and does not verify any official financial transaction. 
            Any resemblance to real companies is purely coincidental.
          </Text>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>NOTES</Text>
            <Text>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View style={styles.footerRow}>
            <View style={styles.footerCol}>
              <Text>{invoice.seller.name}</Text>
              <Text>Address: {invoice.seller.address}, {invoice.seller.city}</Text>
            </View>
            <View style={styles.footerCol}>
              <Text>Email: {invoice.seller.email}</Text>
              <Text>Tel: {invoice.seller.phone}</Text>
            </View>
          </View>
          <Text style={styles.footerNote}>
            Thank you for your business! We look forward to working with you again.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export default InvoiceDocument;
