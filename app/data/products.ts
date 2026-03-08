/**
 * Product Data
 *
 * Elite Affairs event venues and packages - English names
 */

import type { Product } from "../types/order";

export const products: Product[] = [
  {
    id: "1",
    name: "Wattson Bar - Budapest",
    price: 450,
    unit: "rental",
  },
  {
    id: "2",
    name: "Broadway Club & Bar Budapest",
    price: 106,
    unit: "rental",
  },
  {
    id: "3",
    name: "Broadway Club & Bar Budapest - Drink Package",
    price: 16,
    unit: "person",
  },
  {
    id: "4",
    name: "New York Palace - Budapest",
    price: 150,
    unit: "night",
  },
  {
    id: "5",
    name: "Kiosk Budapest",
    price: 32,
    unit: "person",
  },
  {
    id: "6",
    name: "Buddha-Bar Budapest",
    price: 300,
    unit: "hour",
  },
  {
    id: "7",
    name: "Mazel Tov Dohány Street",
    price: 80,
    unit: "package",
  },
  {
    id: "8",
    name: "River Yacht Lounge",
    price: 10160,
    unit: "rental",
  },
  {
    id: "9",
    name: "Crystal Palace Ballroom Budapest City Centre",
    price: 10602,
    unit: "rental",
  },
  {
    id: "10",
    name: "Crystal Palace Ballroom - Menu + Drink Package",
    price: 159,
    unit: "person",
  },
  {
    id: "11",
    name: "Royal Garden Manor Gödöllő",
    price: 3710,
    unit: "rental",
  },
  {
    id: "12",
    name: "Royal Garden Manor - Menu Package",
    price: 9,
    unit: "person",
  },
  {
    id: "13",
    name: "The Grand Royal Estate - Near Budapest",
    price: 6000,
    unit: "rental",
  },
  {
    id: "14",
    name: "The Grand Royal Estate - Menu + Drink Package",
    price: 145,
    unit: "person",
  },
  {
    id: "15",
    name: "Symbol Budapest",
    price: 4766,
    unit: "rental",
  },
  {
    id: "16",
    name: "Symbol Budapest - Menu + Drink Package",
    price: 105,
    unit: "person",
  },
  {
    id: "17",
    name: "The Event Hall of the Royal Palace of Gödöllő",
    price: 9267,
    unit: "rental",
  },
  {
    id: "18",
    name: "Gundel Palace",
    price: 9267,
    unit: "rental",
  }
];

/**
 * Get product by ID
 */
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/**
 * Calculate total for an order item
 */
export function calculateItemTotal(
  productId: string,
  quantity: number,
): number {
  const product = getProductById(productId);
  if (!product) return 0;
  return product.price * quantity;
}
