import { Document, Schema } from 'mongoose';
import { field, schemaHooksWrapper } from './utils'; // Path to utils in core

// Interface for DealProduct properties
export interface IDealProduct {
  deal_id: string;       // References Deals._id
  product_id: string;    // References Products._id (ensure a Products model exists or will exist)
  quantity?: number;
  unit_price?: number;
  discount?: number;     // Assuming fixed amount discount. Add discount_type if % vs fixed is needed.
  total_price?: number;  // This is often calculated: (quantity * unit_price) - discount. Storing it can be for denormalization or if discounts get complex.
  // created_by?: string; // Optional: if tracking who added the product to the deal
}

// Interface for DealProduct document (includes Mongoose Document properties)
export interface IDealProductDocument extends IDealProduct, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema for DealProducts
export const dealProductSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    deal_id: field({ type: String, required: true, index: true, label: "Deal ID" }),
    product_id: field({ type: String, required: true, index: true, label: "Product ID" }),
    quantity: field({ type: Number, optional: true, default: 1, label: "Quantity", min: 0 }),
    unit_price: field({ type: Number, optional: true, label: "Unit Price", min: 0 }), // Should align with product's price if linking actual products
    discount: field({ type: Number, optional: true, default: 0, label: "Discount Amount", min: 0 }),
    total_price: field({ type: Number, optional: true, label: "Total Price", min: 0 }), // Storing calculated price; ensure app logic calculates it.
    // created_by: field({ type: String, optional: true, label: "Created By" }),
  }, { timestamps: true }), 
  'erxes_deal_products' // Cache key
);

// Index for common queries like finding all products for a deal
dealProductSchema.index({ deal_id: 1 });
// Index for finding all deals a product is in (less common, but possible)
dealProductSchema.index({ product_id: 1 });
// Compound index for specific deal-product entries
dealProductSchema.index({ deal_id: 1, product_id: 1 });
