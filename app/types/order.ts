/**
 * Order TypeScript Types
 *
 * Defines all types related to the order form functionality.
 */

// Customer types
export type CustomerType = "individual" | "company";

// Product interface
export interface Product {
  id: string;
  name: string;
  price: number; // Price per unit/serving
  unit: string; // e.g., 'person', 'night', 'hour'
}

// Order item - product selected with quantity
export interface OrderItem {
  id: string; // Unique ID for this line item
  productId: string;
  product?: Product;
  quantity: number;
}

// Customer data based on type
export interface PrivateCustomer {
  type: "individual";
  name: string;
  email: string;
}

export interface CompanyCustomer {
  type: "company";
  name: string;
  taxNumber: string; // Tax number
  email: string;
  bankAccount: string; // Bank account
  address: string; // Address
}

export type Customer = PrivateCustomer | CompanyCustomer;

// Full order structure
export interface Order {
  items: OrderItem[];
  customer: Customer;
  totalAmount: number;
  createdAt: Date;
}

// API Request/Response types
export interface OrderRequest {
  items: OrderItem[];
  customer: Customer;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  orderId?: string;
  emailSent?: boolean;
}

// Form state for the order form
export interface OrderFormState {
  items: OrderItem[];
  customerType: CustomerType;
  customerData: {
    name: string;
    email: string;
    taxNumber: string;
    bankAccount: string;
    address: string;
  };
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}
