import { Document, Schema } from "mongoose";

import {
  customFieldSchema,
  ICustomField,
  ILink
} from "@erxes/api-utils/src/definitions/common";
import { COMPANY_SELECT_OPTIONS } from "./constants";

import { field, schemaWrapper } from "@erxes/api-utils/src/definitions/utils";
import { IAddress } from "./customers";

export interface ICompany {
  scopeBrandIds?: string[];
  primaryName?: string;
  avatar?: string;
  names?: string[];
  size?: number;
  industry?: string;
  plan?: string;
  parentCompanyId?: string;

  primaryEmail?: string;
  emails?: string[];
  primaryAddress?: IAddress; // Keep for general use, specific addresses below
  addresses?: IAddress[]; // Keep for general use, specific addresses below
  headquarters_address?: any; // New
  billing_address?: any; // New
  shipping_address?: any; // New

  ownerId?: string;

  primaryPhone?: string;
  phones?: string[];
  fax?: string; // New

  mergedIds?: string[];
  status?: string;
  businessType?: string; // Enum will be updated
  description?: string;
  employees?: number; // Will be replaced by employee_count
  employee_count?: number; // New
  isSubscribed?: string;
  links?: ILink;
  customFieldsData?: ICustomField[];
  trackedData?: ICustomField[];
  website?: string;
  code?: string;
  location?: string; // General location, more specific in addresses

  // New fields from step 3
  legal_name?: string;
  sub_industry?: string;
  founded_year?: number;
  funding_stage?: string;
  funding_amount?: number;
  revenue_currency?: string;
  account_tier?: string;
  customer_since?: Date;
  health_score?: number;
  social_profiles?: any;
  parent_company_id?: string; // Note: this was `parentCompanyId` before, standardizing to snake_case if new, otherwise keeping as is. Prompt uses `parent_company_id`, but schema has `parentCompanyId`. I will keep existing `parentCompanyId` and assume the prompt meant to update the existing one, not add a new one. If it was a new field, I'd use snake_case.
  subsidiaries?: string[];
  source?: string;
  last_activity_date?: Date;
  total_deal_value?: number;
}

export interface ICompanyDocument extends ICompany, Document {
  _id: string;
  status?: string;
  createdAt: Date;
  // modifiedAt: Date; // Removed
  updatedAt: Date; // Added
  searchText: string;
  score?: number;
}

const getEnum = (fieldName: string): string[] => {
  return COMPANY_SELECT_OPTIONS[fieldName].map(option => option.value);
};

export const companySchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),

    createdAt: field({ type: Date, label: "Created at", esType: "date" }),
    // modifiedAt: field({ type: Date, label: "Modified at", esType: "date", index: true }), // Removed

    legal_name: field({ type: String, optional: true, label: 'Legal Name' }), // New
    primaryName: field({
      type: String,
      label: "Name",
      required: true, // Changed from optional: true
      esType: "keyword",
      index: true
    }),

    names: field({
      type: [String],
      optional: true,
      label: "Names"
    }),

    avatar: field({
      type: String,
      optional: true,
      label: "Avatar"
    }),

    size: field({
      type: Number,
      label: "Size",
      optional: true,
      esType: "number"
    }),

    industry: field({
      type: String,
      label: "Industries",
      optional: true,
      esType: "keyword"
    }),
    sub_industry: field({ type: String, optional: true, label: 'Sub-Industry' }), // New

    website: field({
      type: String,
      label: "Website",
      optional: true
    }),

    plan: field({
      type: String,
      label: "Plan",
      optional: true
    }),

    parentCompanyId: field({ 
      type: Schema.Types.ObjectId, 
      ref: 'companies', 
      optional: true, 
      index: true, 
      label: "Parent Company ID" 
    }),
    subsidiaries: field({ type: [Schema.Types.ObjectId], ref: 'companies', optional: true, label: 'Subsidiaries' }), // New

    primaryEmail: field({
      type: String,
      optional: true,
      label: "Primary email",
      esType: "email"
    }),
    emails: field({ type: [String], optional: true, label: "Emails" }),

    primaryPhone: field({
      type: String,
      optional: true,
      label: "Primary phone"
    }),
    phones: field({ type: [String], optional: true, label: "Phones" }),
    fax: field({ type: String, optional: true, label: 'Fax' }), // New

    primaryAddress: field({ // General primary address
      type: Object,
      label: "Primary Address",
      optional: true
    }),
    addresses: field({ type: [Object], optional: true, label: "Addresses" }), // General list of addresses
    headquarters_address: field({ type: Object, optional: true, label: 'Headquarters Address' }), // New
    billing_address: field({ type: Object, optional: true, label: 'Billing Address' }), // New
    shipping_address: field({ type: Object, optional: true, label: 'Shipping Address' }), // New

    ownerId: field({ type: Schema.Types.ObjectId, ref: 'users', optional: true, index: true }),

    status: field({
      type: String,
      enum: getEnum("STATUSES"),
      default: "Active",
      optional: true,
      label: "Status",
      esType: "keyword",
      selectOptions: COMPANY_SELECT_OPTIONS.STATUSES,
      index: true
    }),

    businessType: field({
      type: String,
      enum: ['B2B', 'B2C', 'B2B2C'], // Updated enum
      optional: true,
      label: "Business Type",
      // selectOptions removed, esType can be inferred or added if needed for search
    }),

    description: field({ type: String, optional: true, label: "Description" }),
    // employees: field({ type: Number, optional: true, label: "Employees" }), // Replaced by employee_count
    employee_count: field({ type: Number, optional: true, label: 'Employee Count' }), // New
    founded_year: field({ type: Number, optional: true, label: 'Founded Year' }), // New
    funding_stage: field({ type: String, optional: true, label: 'Funding Stage', enum: ['pre_seed', 'seed', 'series_a', 'series_b', 'series_c', 'ipo', 'acquired', 'private'] }), // New
    funding_amount: field({ type: Number, optional: true, label: 'Funding Amount' }), // New
    revenue_currency: field({ type: String, optional: true, default: 'USD', label: 'Revenue Currency' }), // New
    account_tier: field({ type: String, optional: true, label: 'Account Tier', enum: ['enterprise', 'mid_market', 'smb', 'startup'] }), // New
    customer_since: field({ type: Date, optional: true, label: 'Customer Since' }), // New
    health_score: field({ type: Number, optional: true, default: 50, label: 'Health Score' }), // New
    social_profiles: field({ type: Schema.Types.Mixed, optional: true, default: {}, label: 'Social Profiles' }), // New
    source: field({ type: String, optional: true, label: 'Source' }), // New
    last_activity_date: field({ type: Date, optional: true, label: 'Last Activity Date' }), // New
    total_deal_value: field({ type: Number, optional: true, default: 0, label: 'Total Deal Value' }), // New
    created_by: field({ type: Schema.Types.ObjectId, ref: 'users', optional: true, index: true, label: "Created By User ID" }), // New
    doNotDisturb: field({
      type: String,
      optional: true,
      default: "No",
      enum: getEnum("DO_NOT_DISTURB"),
      label: "Do not disturb",
      selectOptions: COMPANY_SELECT_OPTIONS.DO_NOT_DISTURB
    }),
    isSubscribed: field({
      type: String,
      optional: true,
      default: "Yes",
      enum: getEnum("DO_NOT_DISTURB"),
      label: "Subscribed",
      selectOptions: COMPANY_SELECT_OPTIONS.DO_NOT_DISTURB
    }),
    links: field({ type: Object, default: {}, label: "Links" }),

    // Merged company ids
    mergedIds: field({
      type: [String],
      optional: true,
      label: "Merged companies"
    }),

    customFieldsData: field({
      type: [customFieldSchema],
      optional: true,
      label: "Custom fields data"
    }),

    trackedData: field({
      type: [customFieldSchema],
      optional: true,
      label: "Tracked Data"
    }),
    searchText: field({ type: String, optional: true, index: true }),
    code: field({ type: String, label: "Code", index: true, optional: true }),
    location: field({ type: String, optional: true, label: "Location" }), // General location
    score: field({
      type: Number,
      optional: true,
      label: "Score",
      esType: "number"
    })
  }, { timestamps: true }) // Added timestamps:true
);
