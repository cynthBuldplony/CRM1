import { Document, Schema } from 'mongoose';
import { field, schemaHooksWrapper } from './utils';

export interface IUserPreference {
  user_id: string;    // References Users._id
  category: string;   // e.g., 'dashboard', 'notifications', 'display'
  preferences: any;   // JSONB in SQL, so Mixed/Object in Mongoose
}

export interface IUserPreferenceDocument extends IUserPreference, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const userPreferenceSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    user_id: field({ type: String, required: true, index: true, label: "User ID" }),
    category: field({ type: String, required: true, index: true, label: "Category" }),
    preferences: field({ type: Schema.Types.Mixed, required: true, default: {}, label: "Preferences" }),
  }, { timestamps: true }),
  'erxes_user_preferences' // Cache key
);

userPreferenceSchema.index({ user_id: 1, category: 1 }, { unique: true });
