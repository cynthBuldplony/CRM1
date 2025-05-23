import { Document, Schema } from 'mongoose';
import { field, schemaHooksWrapper } from './utils'; // Path to utils in core

// Interface for Pipeline properties
export interface IPipeline {
  workspace_id: string;    // Link to Workspace/Brand
  name: string;
  description?: string;
  stages?: string[];         // Ordered array of DealStage IDs
  is_default?: boolean;
  created_by?: string;      // User who created this pipeline
}

// Interface for Pipeline document (includes Mongoose Document properties)
export interface IPipelineDocument extends IPipeline, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema for Pipelines
export const pipelineSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    workspace_id: field({ type: Schema.Types.ObjectId, ref: 'brands', required: true, index: true, label: "Workspace ID" }),
    name: field({ type: String, required: true, label: "Name" }),
    description: field({ type: String, optional: true, label: "Description" }),
    stages: field({ type: [Schema.Types.ObjectId], ref: 'deal_stages', optional: true, label: "Stage IDs" }), // Array of DealStage._id
    is_default: field({ type: Boolean, optional: true, default: false, label: "Is Default Pipeline" }),
    created_by: field({ type: Schema.Types.ObjectId, ref: 'users', optional: true, label: "Created By" }),
  }, { timestamps: true }), // Enable Mongoose's automatic createdAt and updatedAt fields
  'erxes_pipelines' // Cache key, if used by schemaHooksWrapper
);

// Compound unique index for pipeline name within a workspace
pipelineSchema.index({ workspace_id: 1, name: 1 }, { unique: true });
