import { Document, Schema } from 'mongoose';
import { field, schemaWrapper } from './utils';

export interface IBrandEmailConfig {
  email?: string;
  type?: string;
  template?: string;
}

export interface IBrand {
  code?: string;
  name?: string;
  description?: string;
  memberIds?: string[];
  userId?: string;
  emailConfig?: IBrandEmailConfig;

  // New fields for IBrand
  organizationId?: string;
  slug?: string;
  logo_url?: string;
  settings?: any;
  plan?: string;
  plan_limits?: any;
  features?: any;
  status?: string;
  trial_ends_at?: Date;
}

export interface IBrandDocument extends IBrand, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date; // Added for timestamps:true
}

// Mongoose schemas ===========
export const brandEmailConfigSchema = new Schema(
  {
    type: field({
      type: String,
      enum: ['simple', 'custom'],
      label: 'Type'
    }),
    template: field({ type: String, label: 'Template', optional: true }),
    email: field({
      type: String,
      label: 'Email',
      optional: true
    })
  },
  { _id: false }
);

export const brandSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    code: field({ type: String, label: 'Code' }),
    name: field({ type: String, label: 'Name' }),
    description: field({
      type: String,
      optional: true,
      label: 'Description'
    }),
    userId: field({ type: String, label: 'Created by' }),
    createdAt: field({ type: Date, label: 'Created at' }), // Mongoose will manage this via timestamps
    emailConfig: field({
      type: brandEmailConfigSchema,
      label: 'Email config'
    }),

    // New fields for brandSchema
    organizationId: field({ type: Schema.Types.ObjectId, ref: 'organizations', required: true, index: true, label: "Organization ID" }),
    slug: field({ type: String, label: 'Slug', unique: true, sparse: true }),
    logo_url: field({ type: String, optional: true, label: 'Logo URL' }),
    settings: field({ type: Schema.Types.Mixed, optional: true, default: {}, label: 'Settings' }),
    plan: field({ type: String, enum: ['free', 'starter', 'professional', 'enterprise', 'custom'], default: 'free', label: 'Plan' }),
    plan_limits: field({ type: Schema.Types.Mixed, optional: true, default: {}, label: 'Plan Limits' }),
    features: field({ type: Schema.Types.Mixed, optional: true, default: {}, label: 'Features' }),
    status: field({ type: String, enum: ['active', 'trial', 'suspended', 'cancelled'], default: 'trial', label: 'Status' }),
    trial_ends_at: field({ type: Date, optional: true, label: 'Trial Ends At' }),

  }, { timestamps: true }) // Added timestamps:true option
);
