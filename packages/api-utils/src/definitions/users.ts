import { Document, Schema } from 'mongoose';
import { customFieldSchema, ICustomField, ILink } from '../types';
import { IPermissionDocument } from './permissions';
import { field, schemaWrapper } from './utils';
import { USER_ROLES } from '../constants';

export interface IEmailSignature {
  brandId?: string;
  signature?: string;
}

export interface IEmailSignatureDocument extends IEmailSignature, Document {}

export interface IDetail {
  avatar?: string;
  coverPhoto?: string;
  fullName?: string;
  shortName?: string;
  position?: string;
  birthDate?: Date;
  workStartedDate?: Date;
  location?: string;
  description?: string;
  operatorPhone?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  mobile?: string;
}

export interface IDetailDocument extends IDetail, Document {}

export interface IUser {
  createdAt?: Date;
  username?: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  registrationToken?: string;
  registrationTokenExpires?: Date;
  isOwner?: boolean;
  email?: string;
  getNotificationByEmail?: boolean;
  emailSignatures?: IEmailSignature[];
  starredConversationIds?: string[];
  details?: IDetail;
  links?: ILink;
  // isActive?: boolean; // Replaced by status
  status?: string; 
  brandIds?: string[];
  groupIds?: string[];
  deviceTokens?: string[];
  code?: string;
  doNotDisturb?: boolean; // Type changed to boolean
  isSubscribed?: boolean; // Type changed to boolean
  sessionCode?: string;
  isShowNotification?: boolean;
  score?: number;
  customFieldsData?: ICustomField[];
  departmentIds?: string[];
  branchIds?: string[];
  positionIds?: string[];
  employeeId?: string;
  chatStatus?: IUserChatStatus;

  // New top-level fields
  timezone?: string;
  locale?: string;
  last_login_at?: Date;
  last_activity_at?: Date;
  login_count?: number;
  phone_verified?: boolean;
  onboarding_completed?: boolean;
  onboarding_step?: number;
  welcome_tour_completed?: boolean;
}

enum IUserChatStatus {
  online = 'online',
  offline = 'offline',
}

export interface IUserDocument extends IUser, Document {
  _id: string;
  emailSignatures?: IEmailSignatureDocument[];
  details?: IDetailDocument;
  customPermissions?: IPermissionDocument[];
  role?: string;
  appId?: string;
  updatedAt: Date; // Added due to timestamps:true
  displayName?: string; // Added for virtual property
}

// Mongoose schemas ===============================
const emailSignatureSchema = new Schema(
  {
    brandId: field({ type: String, label: 'Email signature nrand' }),
    signature: field({ type: String, label: 'Email signature' }),
  },
  { _id: false },
);

// Detail schema
const detailSchema = new Schema(
  {
    avatar: field({ type: String, label: 'Avatar' }),
    coverPhoto: field({ type: String, label: 'Cover photo' }),
    shortName: field({ type: String, optional: true, label: 'Short name' }),
    fullName: field({ type: String, label: 'Full name' }),
    birthDate: field({ type: Date, label: 'Birth date' }),
    workStartedDate: field({ type: Date, label: 'Date to joined to work' }),
    position: field({ type: String, label: 'Position' }),
    location: field({ type: String, optional: true, label: 'Location' }),
    description: field({ type: String, optional: true, label: 'Description' }),
    operatorPhone: field({
      type: String,
      optional: true,
      label: 'Operator phone',
    }),
    firstName: field({ type: String, label: 'First name' }),
    middleName: field({ type: String, label: 'Middle name' }),
    lastName: field({ type: String, label: 'Last name' }),
  mobile: field({ type: String, optional: true, label: 'Mobile Phone' }),
  },
  { _id: false },
);

// User schema
export const userSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    createdAt: field({
      type: Date,
      // default: Date.now, // Removed: managed by timestamps:true
      label: 'Created at',
    }),
    username: field({ type: String, label: 'Username' }),
    password: field({ type: String, optional: true }),
    resetPasswordToken: field({ type: String }),
    registrationToken: field({ type: String }),
    registrationTokenExpires: field({ type: Date }),
    resetPasswordExpires: field({ type: Date }),
    isOwner: field({ type: Boolean, label: 'Is owner' }),
    departmentIds: field({ type: [String], label: 'Department Ids' }),
    branchIds: field({ type: [String], label: 'Branch Ids' }),
    positionIds: field({ type: [String], label: 'Position Ids' }),
    email: field({
      type: String,
      unique: true,
      match: [
        /**
         * RFC 5322 compliant regex. Taken from http://emailregex.com/
         */
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please fill a valid email address',
      ],
      label: 'Email',
    }),
    getNotificationByEmail: field({
      type: Boolean,
      label: 'Get notification by email',
    }),
    emailSignatures: field({
      type: [emailSignatureSchema],
      label: 'Email signatures',
    }),
    starredConversationIds: field({
      type: [String],
      label: 'Starred conversations',
    }),
    details: field({ type: detailSchema, default: {}, label: 'Details' }),
    links: field({ type: Object, default: {}, label: 'Links' }),
    // isActive: field({ type: Boolean, default: true, label: 'Is active' }), // Removed
    status: field({ 
      type: String, 
      enum: ['active', 'inactive', 'pending', 'suspended'], 
      default: 'pending', 
      label: 'Status', 
      index: true 
    }),
    brandIds: field({ type: [String], label: 'Brands' }),
    groupIds: field({ type: [String], label: 'Groups' }),
    deviceTokens: field({
      type: [String],
      default: [],
      label: 'Device tokens',
    }),
    code: field({ type: String }),
    doNotDisturb: field({
      type: Boolean, // Type changed to Boolean
      optional: true,
      default: false, // Default changed to false
      label: 'Do not disturb',
    }),
    isSubscribed: field({
      type: Boolean, // Type changed to Boolean
      optional: true,
      default: true, // Default changed to true
      label: 'Subscribed',
    }),
    isShowNotification: field({
      type: Boolean,
      optional: true,
      default: false,
      label: 'Check if user shows',
    }),
    score: field({
      type: Number,
      optional: true,
      label: 'Score',
      esType: 'number',
      default: 0,
    }),
    customFieldsData: field({
      type: [customFieldSchema],
      optional: true,
      label: 'Custom fields data',
    }),
    role: field({
      type: String,
      label: 'User role',
      optional: true,
      default: 'user', // Changed default
      enum: ['system', 'user', 'super_admin', 'admin', 'manager', 'sales', 'support', 'marketing', 'viewer'], // Updated enum
    }),
    appId: field({
      type: String,
      label: 'Linked app id',
      optional: true,
    }),
    employeeId: field({
      type: String,
      unique: true,
      optional: true,
      sparse: true,
    }),
    chatStatus: field({
      type: String,
      enum: Object.values(IUserChatStatus),
      optional: true,
      label: 'User chat status /used for exm/',
    }),

    // New top-level fields schema definitions
    timezone: field({ type: String, optional: true, label: 'Timezone' }),
    locale: field({ type: String, optional: true, label: 'Locale' }),
    last_login_at: field({ type: Date, optional: true, label: 'Last Login At' }),
    last_activity_at: field({ type: Date, optional: true, label: 'Last Activity At' }),
    login_count: field({ type: Number, optional: true, default: 0, label: 'Login Count' }),
    phone_verified: field({ type: Boolean, optional: true, default: false, label: 'Phone Verified' }),
    onboarding_completed: field({ type: Boolean, optional: true, default: false, label: 'Onboarding Completed' }),
    onboarding_step: field({ type: Number, optional: true, default: 0, label: 'Onboarding Step' }),
    welcome_tour_completed: field({ type: Boolean, optional: true, default: false, label: 'Welcome Tour Completed' }),

  }, 
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } } // Added options
);

userSchema.virtual('displayName').get(function(this: IUserDocument) {
  if (this.details && this.details.firstName && this.details.lastName) {
    return `${this.details.firstName} ${this.details.lastName}`.trim();
  }
  if (this.details && this.details.fullName) { // Fallback to existing fullName
    return this.details.fullName;
  }
  return this.email || this.username || ''; // Further fallback
});
