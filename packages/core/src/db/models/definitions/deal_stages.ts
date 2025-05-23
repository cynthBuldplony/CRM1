import { Document, Schema } from 'mongoose';
import { field, schemaHooksWrapper } from './utils'; // Path to utils in core

// Interface for Deal Stage properties
export interface IDealStage {
  workspace_id: string;    // Link to Workspace/Brand
  pipeline_id: string;     // Link to the Pipeline/Board this stage belongs to
  name: string;
  description?: string;
  probability?: number;    // 0-100
  color?: string;          // Hex color
  order_index: number;
  is_closed_won?: boolean;
  is_closed_lost?: boolean;
  automation_triggers?: any; // Representing JSONB from SQL
  created_by?: string;     // User who created this stage
}

// Interface for Deal Stage document (includes Mongoose Document properties)
export interface IDealStageDocument extends IDealStage, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema for Deal Stages
export const dealStageSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    workspace_id: field({ type: Schema.Types.ObjectId, ref: 'brands', required: true, index: true, label: "Workspace ID" }),
    pipeline_id: field({ type: Schema.Types.ObjectId, ref: 'pipelines', required: true, index: true, label: "Pipeline ID" }),
    name: field({ type: String, required: true, label: "Name" }),
    description: field({ type: String, optional: true, label: "Description" }),
    probability: field({ type: Number, optional: true, default: 0, label: "Probability" }),
    color: field({ type: String, optional: true, label: "Color Code" }),
    order_index: field({ type: Number, required: true, default: 0, label: "Order Index" }),
    is_closed_won: field({ type: Boolean, optional: true, default: false, label: "Is Closed Won" }),
    is_closed_lost: field({ type: Boolean, optional: true, default: false, label: "Is Closed Lost" }),
    automation_triggers: field({ type: Schema.Types.Mixed, optional: true, label: "Automation Triggers" }),
    created_by: field({ type: Schema.Types.ObjectId, ref: 'users', optional: true, label: "Created By" }),
  }, { timestamps: true }), // Enable Mongoose's automatic createdAt and updatedAt fields
  'erxes_deal_stages' // Cache key, if used by schemaHooksWrapper
);

// Compound unique index for stage name within a specific pipeline and workspace
dealStageSchema.index({ workspace_id: 1, pipeline_id: 1, name: 1 }, { unique: true });

// Index to help with ordering stages within a pipeline
dealStageSchema.index({ workspace_id: 1, pipeline_id: 1, order_index: 1 });
