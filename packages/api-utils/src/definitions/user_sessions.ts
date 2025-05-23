import { Document, Schema } from 'mongoose';
import { field } from './utils'; // Assuming field util is available and appropriate

export enum DeviceType {
  WEB = 'web',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  API = 'api',
}

export interface IUserSession {
  user_id: string;    // References Users._id
  token_hash: string;
  refresh_token_hash?: string;
  device_type?: DeviceType;
  device_name?: string;
  browser?: string;
  os?: string;
  ip_address?: string;
  location?: any;      // For JSONB
  expires_at: Date;
  // last_used_at will be represented by updatedAt from timestamps
}

export interface IUserSessionDocument extends IUserSession, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date; 
}

export const userSessionSchema = new Schema({
  _id: field({ pkey: true }), // Assuming field util provides _id with default like nanoid
  user_id: field({ type: String, required: true, index: true, label: "User ID" }),
  token_hash: field({ type: String, required: true, label: "Token Hash" }),
  refresh_token_hash: field({ type: String, optional: true, label: "Refresh Token Hash" }),
  device_type: field({ type: String, enum: Object.values(DeviceType), default: DeviceType.WEB, label: "Device Type" }),
  device_name: field({ type: String, optional: true, label: "Device Name" }),
  browser: field({ type: String, optional: true, label: "Browser" }),
  os: field({ type: String, optional: true, label: "Operating System" }),
  ip_address: field({ type: String, optional: true, label: "IP Address" }),
  location: field({ type: Schema.Types.Mixed, optional: true, label: "Location" }),
  expires_at: field({ type: Date, required: true, label: "Expires At" }),
}, { timestamps: true }); // createdAt and updatedAt (for last_used_at)

userSessionSchema.index({ user_id: 1, expires_at: 1 });
userSessionSchema.index({ token_hash: 1 }, { unique: true });
userSessionSchema.index({ refresh_token_hash: 1, unique: true, sparse: true }); // Refresh tokens must also be unique if present
