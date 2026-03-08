"use client";

import { useState, useMemo } from "react";
import { products } from "../data/products";
import type { CustomerType, OrderItem, Customer } from "../types/order";

export default function OrderForm() {
  // Customer type toggle
  const [customerType, setCustomerType] =
    useState<CustomerType>("individual");

  // Order items
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: "1", productId: "", quantity: 1 },
  ]);

  // Customer data
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    taxNumber: "",
    bankAccount: "",
    address: "",
  });

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Generate unique ID for new items
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Add new order item
  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      { id: generateId(), productId: "", quantity: 1 },
    ]);
  };

  // Remove order item
  const removeOrderItem = (id: string) => {
    if (orderItems.length === 1) return; // Keep at least one item
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  // Update order item
  const updateOrderItem = (
    id: string,
    field: "productId" | "quantity",
    value: string | number,
  ) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  // Update customer data
  const updateCustomerData = (field: string, value: string) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate totals
  const totals = useMemo(() => {
    let subtotal = 0;
    const itemsWithProducts = orderItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const total = product ? product.price * item.quantity : 0;
      subtotal += total;
      return { ...item, product, total };
    });
    return { items: itemsWithProducts, subtotal };
  }, [orderItems]);

  // Validate form
  const validateForm = (): string | null => {
    // Check if at least one product is selected
    const hasValidItems = orderItems.some(
      (item) => item.productId && item.quantity > 0,
    );
    if (!hasValidItems) {
      return "Please select at least one product!";
    }

    // Validate customer data
    if (!customerData.name.trim()) {
      return "Please enter your name!";
    }

    if (!customerData.email.trim() || !customerData.email.includes("@")) {
      return "Please enter your email address!";
    }

    if (customerType === "company") {
      if (!customerData.taxNumber.trim()) {
        return "Please enter your tax number!";
      }
      if (!customerData.bankAccount.trim()) {
        return "Please enter your bank account number!";
      }
      if (!customerData.address.trim()) {
        return "Please enter your address!";
      }
    }

    return null;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setSubmitStatus({ success: false, message: validationError });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Build customer object based on type
      const customer: Customer =
        customerType === "individual"
          ? {
              type: "individual",
              name: customerData.name,
              email: customerData.email,
            }
          : {
              type: "company",
              name: customerData.name,
              taxNumber: customerData.taxNumber,
              email: customerData.email,
              bankAccount: customerData.bankAccount,
              address: customerData.address,
            };

      // Filter valid items and add product info
      const validItems = orderItems
        .filter((item) => item.productId && item.quantity > 0)
        .map((item) => ({
          ...item,
          product: products.find((p) => p.id === item.productId),
        }));

      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: validItems,
          customer,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          success: true,
          message:
            "Your order has been submitted successfully! You will receive the invoice via email.",
        });
        // Reset form
        setOrderItems([{ id: "1", productId: "", quantity: 1 }]);
        setCustomerData({
          name: "",
          email: "",
          taxNumber: "",
          bankAccount: "",
          address: "",
        });
      } else {
        setSubmitStatus({
          success: false,
          message:
            result.message || "An error occurred while processing your order.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message:
          "A network error occurred. Please try again!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-onyx-100 rounded-xl shadow-lg border border-onyx-300">
      <h1 className="text-3xl font-bold mb-8 text-center text-carbon-black-900">Order</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer Type Toggle */}
        <div className="bg-onyx-50 p-6 rounded-lg border border-onyx-300">
          <h2 className="text-xl font-semibold mb-4 text-carbon-black-900">Customer Type</h2>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setCustomerType("individual")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                customerType === "individual"
                  ? "bg-dark-khaki-600 text-white"
                  : "bg-white border-2 border-onyx-400 hover:border-dark-khaki-500 text-carbon-black-800"
              }`}
            >
              Individual
            </button>
            <button
              type="button"
              onClick={() => setCustomerType("company")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                customerType === "company"
                  ? "bg-dark-khaki-600 text-white"
                  : "bg-white border-2 border-onyx-400 hover:border-dark-khaki-500 text-carbon-black-800"
              }`}
            >
              Company
            </button>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-onyx-50 p-6 rounded-lg border border-onyx-300">
          <h2 className="text-xl font-semibold mb-4 text-carbon-black-900">Products</h2>

          <div className="space-y-4">
            {orderItems.map((item, index) => (
              <div
                key={item.id}
                className="flex gap-4 items-start bg-white p-4 rounded-lg border-2 border-onyx-200"
              >
                <div className="flex-1">
                  <label className="block text-sm font-medium text-carbon-black-800 mb-1">
                    Product
                  </label>
                  <select
                    value={item.productId}
                    onChange={(e) =>
                      updateOrderItem(item.id, "productId", e.target.value)
                    }
                    className="w-full px-4 py-2 border-2 border-onyx-300 rounded-lg focus:ring-2 focus:ring-dark-khaki-500 focus:border-transparent bg-white text-carbon-black-900"
                  >
                    <option value="">Select a product...</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.price.toLocaleString("en-US")}{" "}
                        €/{product.unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-32">
                  <label className="block text-sm font-medium text-carbon-black-800 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateOrderItem(
                        item.id,
                        "quantity",
                        parseInt(e.target.value) || 1,
                      )
                    }
                    className="w-full px-4 py-2 border-2 border-onyx-300 rounded-lg focus:ring-2 focus:ring-dark-khaki-500 focus:border-transparent bg-white text-carbon-black-900"
                  />
                </div>

                <div className="w-32 pt-6 text-right font-medium text-carbon-black-800">
                  {totals.items[index]?.total?.toLocaleString("en-US") || 0} €
                </div>

                <button
                  type="button"
                  onClick={() => removeOrderItem(item.id)}
                  disabled={orderItems.length === 1}
                                                      className="mt-6 p-2 text-red-800 hover:bg-red-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete item"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addOrderItem}
                                    className="mt-4 px-4 py-2 text-dark-khaki-700 hover:bg-dark-khaki-100 rounded-lg font-medium"
          >
            + Add New Item
          </button>

          {/* Total */}
          <div className="mt-6 text-right">
            <span className="text-lg font-semibold text-carbon-black-800">Total: </span>
            <span className="text-2xl font-bold text-dark-khaki-700">
              {totals.subtotal.toLocaleString("en-US")} €
            </span>
          </div>
        </div>

        {/* Customer Data */}
        <div className="bg-onyx-50 p-6 rounded-lg border border-onyx-300">
          <h2 className="text-xl font-semibold mb-4 text-carbon-black-900">
            {customerType === "individual"
              ? "Personal Information"
              : "Company Information"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Common fields */}
            <div>
              <label className="block text-sm font-medium text-carbon-black-800 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={customerData.name}
                onChange={(e) => updateCustomerData("name", e.target.value)}
                className="w-full px-4 py-2 border-2 border-onyx-300 rounded-lg focus:ring-2 focus:ring-dark-khaki-500 focus:border-transparent bg-white text-carbon-black-900"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-carbon-black-800 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={customerData.email}
                onChange={(e) => updateCustomerData("email", e.target.value)}
                className="w-full px-4 py-2 border-2 border-onyx-300 rounded-lg focus:ring-2 focus:ring-dark-khaki-500 focus:border-transparent bg-white text-carbon-black-900"
                placeholder="email@example.com"
              />
            </div>

            {/* Company-specific fields */}
            {customerType === "company" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-carbon-black-800 mb-1">
                    Tax Number *
                  </label>
                  <input
                    type="text"
                    value={customerData.taxNumber}
                    onChange={(e) =>
                      updateCustomerData("taxNumber", e.target.value)
                    }
                    className="w-full px-4 py-2 border-2 border-onyx-300 rounded-lg focus:ring-2 focus:ring-dark-khaki-500 focus:border-transparent bg-white text-carbon-black-900"
                    placeholder="12345678-2-41"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-carbon-black-800 mb-1">
                    Bank Account *
                  </label>
                  <input
                    type="text"
                    value={customerData.bankAccount}
                    onChange={(e) =>
                      updateCustomerData("bankAccount", e.target.value)
                    }
                    className="w-full px-4 py-2 border-2 border-onyx-300 rounded-lg focus:ring-2 focus:ring-dark-khaki-500 focus:border-transparent bg-white text-carbon-black-900"
                    placeholder="12345678-90123456-78901234"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-carbon-black-800 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={customerData.address}
                    onChange={(e) =>
                      updateCustomerData("address", e.target.value)
                    }
                    className="w-full px-4 py-2 border-2 border-onyx-300 rounded-lg focus:ring-2 focus:ring-dark-khaki-500 focus:border-transparent bg-white text-carbon-black-900"
                    placeholder="Address (zip code, city, street, number)"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {submitStatus && (
          <div
            className={`p-4 rounded-lg ${
              submitStatus.success
                ? "bg-dark-khaki-100 text-dark-khaki-900 border-2 border-dark-khaki-400"
                : "bg-red-100 text-red-900 border-2 border-red-300"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
                              className="w-full py-4 px-6 bg-dark-khaki-600 text-white font-bold text-lg rounded-lg hover:bg-dark-khaki-700 transition-colors disabled:bg-onyx-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Submit Order"}
        </button>
      </form>
    </div>
  );
}
