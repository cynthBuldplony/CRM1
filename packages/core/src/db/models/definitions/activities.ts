import { Document, Schema, Types } from 'mongoose'; // Ensure Types is imported
import { field, schemaHooksWrapper } from './utils';

export enum ActivityType {
  CALL = 'call',
  EMAIL = 'email',
  MEETING = 'meeting',
  TASK = 'task',
}

export enum ActivityStatus {
  OPEN = 'open',
  COMPLETED = 'completed',
}

export interface IRelatedEntity {
  entityId: string; // ObjectId of the related entity (will be string in interface)
  entityType: string; // e.g., 'deal', 'customer', 'company'
}

// Sub-schema for related entities
const relatedEntitySchema = new Schema({
  entityId: { type: Schema.Types.ObjectId, required: true }, // No ref as it's polymorphic
  entityType: { type: String, required: true },
}, { _id: false });

export interface IActivity {
  workspace_id: string;
  subject: string;
  type?: ActivityType;
  dueDate?: Date;
  status?: ActivityStatus;
  assignedToId?: string; // References Users._id
  relatedTo?: IRelatedEntity[];
  description?: string;
  created_by?: string;   // References Users._id
}

export interface IActivityDocument extends IActivity, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const activitySchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    workspace_id: field({ type: Schema.Types.ObjectId, ref: 'brands', required: true, index: true, label: "Workspace ID" }),
    subject: field({ type: String, required: true, label: "Subject" }),
    type: field({ type: String, enum: Object.values(ActivityType), default: ActivityType.TASK, label: "Type" }),
    dueDate: field({ type: Date, optional: true, index: true, label: "Due Date" }),
    status: field({ type: String, enum: Object.values(ActivityStatus), default: ActivityStatus.OPEN, index: true, label: "Status" }),
    assignedToId: field({ type: Schema.Types.ObjectId, ref: 'users', optional: true, index: true, label: "Assigned To User ID" }),
    relatedTo: field({ type: [relatedEntitySchema], optional: true, label: "Related To" }),
    description: field({ type: String, optional: true, label: "Description" }),
    created_by: field({ type: Schema.Types.ObjectId, ref: 'users', optional: true, label: "Created By User ID" }),
  }, { timestamps: true }),
  'erxes_activities' // Cache key
);

activitySchema.index({ workspace_id: 1, status: 1, dueDate: 1 });
activitySchema.index({ workspace_id: 1, assignedToId: 1, status: 1 });
// Index for relatedTo array (if querying by related entities is common)
// Mongoose does not directly index array sub-document fields in a way that's efficient for this type of query.
// Application-level logic or specific denormalization might be needed if there are performance issues here.
// For now, indexing the presence of relatedTo items might be:
// activitySchema.index({ 'relatedTo.entityId': 1, 'relatedTo.entityType': 1 }); // If needed
