import { Document, Schema } from 'mongoose';
import { field, schemaHooksWrapper } from './utils'; // Assuming utils.ts provides these

export interface IEntityTag {
  workspace_id: string;
  tag_id: string;
  entity_id: string;
  entity_type: string;
  created_by?: string;
}

export interface IEntityTagDocument extends IEntityTag, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const entityTagSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    workspace_id: field({ type: String, required: true, index: true, label: "Workspace ID" }),
    tag_id: field({ type: String, required: true, index: true, label: "Tag ID" }), // References Tags._id
    entity_id: field({ type: String, required: true, index: true, label: "Entity ID" }),
    entity_type: field({ type: String, required: true, index: true, label: "Entity Type" }), // e.g., 'customer', 'company', 'deal'
    created_by: field({ type: String, optional: true, label: "Created By" }) // References Users._id
  }, { timestamps: true }), // Enable Mongoose timestamps
  'erxes_entity_tags' // Cache key for Redis, if applicable
);

// Add compound index for entity_id and entity_type
entityTagSchema.index({ entity_id: 1, entity_type: 1 });
// Note: workspace_id, tag_id are already indexed individually.
// A compound unique index might be useful too: { workspace_id: 1, tag_id: 1, entity_id: 1, entity_type: 1 }
entityTagSchema.index({ workspace_id: 1, tag_id: 1, entity_id: 1, entity_type: 1 }, { unique: true });
