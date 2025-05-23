import { Document, Schema } from "mongoose";

import {
  customFieldSchema,
  ICustomField,
  ILink
} from "@erxes/api-utils/src/definitions/common";
import { CUSTOMER_SELECT_OPTIONS } from "./constants";

import { field, schemaWrapper } from "@erxes/api-utils/src/definitions/utils";

export interface ILocation {
  remoteAddress: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  hostname: string;
  language: string;
  userAgent: string;
}

export interface ILocationDocument extends ILocation, Document {}

export interface IVisitorContact {
  email?: string;
  phone?: string;
}

export interface IVisitorContactDocument extends IVisitorContact, Document {}

export interface IAddress {
  id: string; // lng_lat || random
  location: {
    type: string;
    coordinates: number[];
  };
  address: {
    countryCode: string;
    country: string;
    postCode: string;
    city: string;
    city_district: string;
    suburb: string;
    road: string;
    street: string;
    building: string;
    number: string;
    other: string;
  };
  short: string;
}

export interface ICustomer {
  state?: "visitor" | "lead" | "customer";

  scopeBrandIds?: string[];
  firstName?: string;
  lastName?: string;
  middleName?: string;
  prefix?: string;
  suffix?: string;
  birthDate?: Date;
  sex?: number;
  primaryEmail?: string;
  emails?: string[];
  email_2?: string; // New
  avatar?: string;
  primaryPhone?: string;
  phones?: string[];
  fax?: string; // New
  primaryAddress?: IAddress;
  addresses?: IAddress[];
  shipping_address?: IAddress; // New
  billing_address?: IAddress; // New

  ownerId?: string;
  position?: string;
  department?: string;
  leadStatus?: string;
  hasAuthority?: string;
  description?: string;
  doNotDisturb?: string;
  isSubscribed?: string;
  emailValidationStatus?: string;
  phoneValidationStatus?: string;
  links?: ILink;
  relatedIntegrationIds?: string[];
  integrationId?: string;
  social_profiles?: any; // New
  source?: string; // New
  industry?: string; // New
  lead_score?: number; // New
  lifecycle_stage?: string; // New
  account_manager_id?: string; // New
  relationship_strength?: string; // New
  last_contact_date?: Date; // New
  next_contact_date?: Date; // New
  email_opt_in?: boolean; // New
  sms_opt_in?: boolean; // New
  do_not_call?: boolean; // New
  preferred_contact_method?: string; // New
  communication_frequency?: string; // New
  referral_source?: string; // New
  first_seen?: Date; // New
  interaction_count?: number; // New

  // TODO migrate after remove 1row
  companyIds?: string[];

  mergedIds?: string[];
  status?: string;
  customFieldsData?: ICustomField[];
  trackedData?: ICustomField[];
  location?: ILocation;
  visitorContactInfo?: IVisitorContact;
  deviceTokens?: string[];
  code?: string;
  isOnline?: boolean;
  lastSeenAt?: Date;
  sessionCount?: number;
  visitorId?: string;
  data?: any;
}

export interface IValidationResponse {
  email?: string;
  phone?: string;
  status: string;
}

export interface ICustomerDocument extends ICustomer, Document {
  _id: string;
  location?: ILocationDocument;
  visitorContactInfo?: IVisitorContactDocument;
  profileScore?: number;
  score?: number;
  status?: string;
  createdAt: Date;
  // modifiedAt: Date; // Removed
  updatedAt: Date; // Added
  deviceTokens?: string[];
  searchText?: string;
}

/* location schema */
export const locationSchema = new Schema(
  {
    remoteAddress: field({
      type: String,
      label: "Remote address",
      optional: true
    }),
    country: field({ type: String, label: "Country", optional: true }),
    countryCode: field({ type: String, label: "Country code", optional: true }),
    city: field({ type: String, label: "City", optional: true }),
    region: field({ type: String, label: "Region", optional: true }),
    hostname: field({ type: String, label: "Host name", optional: true }),
    language: field({ type: String, label: "Language", optional: true }),
    userAgent: field({ type: String, label: "User agent", optional: true })
  },
  { _id: false }
);

export const visitorContactSchema = new Schema(
  {
    email: field({ type: String, label: "Email", optional: true }),
    phone: field({ type: String, label: "Phone", optional: true })
  },
  { _id: false }
);

const getEnum = (fieldName: string): string[] => {
  return CUSTOMER_SELECT_OPTIONS[fieldName].map(option => option.value);
};

export const customerSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),

    state: field({
      type: String,
      esType: "keyword",
      label: "State",
      default: "visitor",
      enum: getEnum("STATE"),
      index: true,
      selectOptions: CUSTOMER_SELECT_OPTIONS.STATE
    }),

    createdAt: field({ type: Date, label: "Created at", esType: "date" }),
    // modifiedAt: field({ type: Date, label: "Modified at", esType: "date", index: true }), // Removed
    avatar: field({ type: String, optional: true, label: "Avatar" }),

    prefix: field({ type: String, optional: true, label: 'Prefix' }),
    firstName: field({ type: String, label: "First name", optional: true }),
    middleName: field({ type: String, label: "Middle name", optional: true }),
    lastName: field({ type: String, label: "Last name", optional: true }),
    suffix: field({ type: String, optional: true, label: 'Suffix' }),

    birthDate: field({
      type: Date,
      label: "Date of birth",
      optional: true,
      esType: "date"
    }),
    sex: field({
      type: Number,
      label: "Pronoun",
      optional: true,
      esType: "keyword",
      default: 0,
      enum: getEnum("SEX"),
      selectOptions: CUSTOMER_SELECT_OPTIONS.SEX
    }),

    primaryEmail: field({
      type: String,
      label: "Primary Email",
      optional: true,
      esType: "email",
      index: true
    }),
    emails: field({ type: [String], optional: true, label: "Emails" }),
    email_2: field({ type: String, optional: true, label: 'Secondary Email' }),
    emailValidationStatus: field({
      type: String,
      enum: getEnum("EMAIL_VALIDATION_STATUSES"),
      default: "unknown",
      label: "Email validation status",
      esType: "keyword",
      selectOptions: CUSTOMER_SELECT_OPTIONS.EMAIL_VALIDATION_STATUSES
    }),

    primaryPhone: field({
      type: String,
      label: "Primary Phone",
      optional: true
    }),
    phones: field({ type: [String], optional: true, label: "Phones" }),
    fax: field({ type: String, optional: true, label: 'Fax' }),

    primaryAddress: field({
      type: Object,
      label: "Primary Address",
      optional: true
    }),
    addresses: field({ type: [Object], optional: true, label: "Addresses" }),
    shipping_address: field({ type: Object, optional: true, label: 'Shipping Address' }),
    billing_address: field({ type: Object, optional: true, label: 'Billing Address' }),

    phoneValidationStatus: field({
      type: String,
      enum: getEnum("PHONE_VALIDATION_STATUSES"),
      default: "unknown",
      label: "Phone validation status",
      esType: "keyword",
      selectOptions: CUSTOMER_SELECT_OPTIONS.PHONE_VALIDATION_STATUSES
    }),
    profileScore: field({
      type: Number,
      index: true,
      optional: true,
      esType: "number"
    }),

    score: field({
      type: Number,
      optional: true,
      label: "Score",
      esType: "number"
    }),

    ownerId: field({ type: String, optional: true, index: true }),
    position: field({
      type: String,
      optional: true,
      label: "Position",
      esType: "keyword"
    }),
    department: field({ type: String, optional: true, label: "Department" }),

    leadStatus: field({
      type: String,
      enum: getEnum("LEAD_STATUS_TYPES"),
      optional: true,
      label: "Lead Status",
      esType: "keyword",
      selectOptions: CUSTOMER_SELECT_OPTIONS.LEAD_STATUS_TYPES
    }),

    status: field({
      type: String,
      enum: getEnum("STATUSES"),
      optional: true,
      label: "Status",
      default: "Active",
      esType: "keyword",
      index: true,
      selectOptions: CUSTOMER_SELECT_OPTIONS.STATUSES
    }),

    hasAuthority: field({
      type: String,
      optional: true,
      default: "No",
      label: "Has authority",
      enum: getEnum("HAS_AUTHORITY"),
      selectOptions: CUSTOMER_SELECT_OPTIONS.HAS_AUTHORITY
    }),
    description: field({ type: String, optional: true, label: "Description" }),
    doNotDisturb: field({
      type: String,
      optional: true,
      default: "No",
      enum: getEnum("DO_NOT_DISTURB"),
      label: "Do not disturb",
      selectOptions: CUSTOMER_SELECT_OPTIONS.DO_NOT_DISTURB
    }),
    isSubscribed: field({
      type: String,
      optional: true,
      default: "Yes",
      enum: getEnum("DO_NOT_DISTURB"),
      label: "Subscribed",
      selectOptions: CUSTOMER_SELECT_OPTIONS.DO_NOT_DISTURB
    }),
    links: field({ type: Object, default: {}, label: "Links" }),

    relatedIntegrationIds: field({
      type: [String],
      label: "Related integrations",
      esType: "keyword",
      optional: true
    }),
    integrationId: field({
      type: String,
      optional: true,
      label: "Integration",
      index: true,
      esType: "keyword"
    }),

    // Merged customer ids
    mergedIds: field({ type: [String], optional: true }),

    trackedData: field({
      type: [customFieldSchema],
      optional: true,
      label: "Tracked Data"
    }),
    customFieldsData: field({
      type: [customFieldSchema],
      optional: true,
      label: "Custom fields data"
    }),

    location: field({
      type: locationSchema,
      optional: true,
      label: "Location"
    }),

    // if customer is not a user then we will contact with this visitor using
    // this information
    visitorContactInfo: field({
      type: visitorContactSchema,
      optional: true,
      label: "Visitor contact info"
    }),

    deviceTokens: field({ type: [String], default: [] }),
    searchText: field({ type: String, optional: true, index: true }),
    code: field({ type: String, label: "Code", index: true, optional: true }),

    isOnline: field({
      type: Boolean,
      label: "Is online",
      optional: true
    }),
    lastSeenAt: field({
      type: Date,
      label: "Last seen at",
      optional: true,
      esType: "date"
    }),
    sessionCount: field({
      type: Number,
      label: "Session count",
      optional: true,
      esType: "number"
    }),
    visitorId: field({ type: String, optional: true }),
    data: field({ type: Object, optional: true }),

    // New fields from step 3 of prompt
    social_profiles: field({ type: Schema.Types.Mixed, optional: true, default: {}, label: 'Social Profiles' }),
    source: field({ type: String, optional: true, label: 'Lead Source' }),
    industry: field({ type: String, optional: true, label: 'Industry' }),
    lead_score: field({ type: Number, optional: true, default: 0, label: 'Lead Score' }),
    lifecycle_stage: field({ type: String, optional: true, label: 'Lifecycle Stage', enum: ['subscriber', 'lead', 'marketing_qualified_lead', 'sales_qualified_lead', 'opportunity', 'customer', 'evangelist', 'other'], default: 'lead' }),
    account_manager_id: field({ type: String, optional: true, label: 'Account Manager ID' }),
    relationship_strength: field({ type: String, optional: true, label: 'Relationship Strength', enum: ['cold', 'warm', 'hot'], default: 'warm' }),
    last_contact_date: field({ type: Date, optional: true, label: 'Last Contact Date' }),
    next_contact_date: field({ type: Date, optional: true, label: 'Next Contact Date' }),
    email_opt_in: field({ type: Boolean, optional: true, default: true, label: 'Email Opt-In' }),
    sms_opt_in: field({ type: Boolean, optional: true, default: false, label: 'SMS Opt-In' }),
    do_not_call: field({ type: Boolean, optional:true, default: false, label: 'Do Not Call' }),
    preferred_contact_method: field({ type: String, optional: true, label: 'Preferred Contact Method', enum: ['email', 'phone', 'text', 'mail'], default: 'email' }),
    communication_frequency: field({ type: String, optional: true, label: 'Communication Frequency', enum: ['daily', 'weekly', 'monthly', 'quarterly'], default: 'weekly' }),
    referral_source: field({ type: String, optional: true, label: 'Referral Source' }),
    first_seen: field({ type: Date, optional: true, label: 'First Seen At' }),
    interaction_count: field({ type: Number, optional: true, default: 0, label: 'Interaction Count' }),

  }, { timestamps: true }) // Added timestamps:true
);
