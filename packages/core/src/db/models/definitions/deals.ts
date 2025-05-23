import { Document, Schema } from 'mongoose';
import { field, schemaHooksWrapper } from './utils'; // Path to utils in core
// Ensure ICustomField and customFieldSchema are correctly imported
// Assuming they might be in a shared location like api-utils, adjust if necessary for core context
// For now, let's assume a placeholder or that they'd be defined/imported appropriately if this was in a plugin
// For core, it might be: import { ICustomField, customFieldSchema } from '@erxes/api-utils/src/definitions/common';
import { ICustomField, customFieldSchema } from '../../../api-utils/src/definitions/common';


// Interface for Deal properties
export interface IDeal {
  workspace_id: string;
  pipeline_id: string;
  stage_id: string;
  name: string;
  description?: string;
  deal_type?: string; // ENUM: 'new_business', 'existing_business', 'renewal', 'upsell', 'cross_sell'
  value?: number;
  currency?: string;
  expected_revenue?: number;
  probability?: number; // 0-100, can be set from stage or overridden on the deal
  expected_close_date?: Date;
  actual_close_date?: Date;
  owner_id?: string;     // User ID
  team_id?: string;      // Team ID
  source?: string;       // Lead source
  lost_reason?: string;
  priority?: string;   // ENUM: 'low', 'medium', 'high', 'urgent'
  customFieldsData?: ICustomField[];
  created_by?: string;
  company_id?: string;      // ObjectId ref to Company collection
  contact_ids?: string[];   // Array of ObjectId refs to Customer collection
}

// Interface for Deal document (includes Mongoose Document properties)
export interface IDealDocument extends IDeal, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema for Deals
export const dealSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    workspace_id: field({ type: Schema.Types.ObjectId, ref: 'brands', required: true, index: true, label: "Workspace ID" }),
    pipeline_id: field({ type: Schema.Types.ObjectId, ref: 'pipelines', required: true, index: true, label: "Pipeline ID" }),
    stage_id: field({ type: Schema.Types.ObjectId, ref: 'deal_stages', required: true, index: true, label: "Stage ID" }),
    name: field({ type: String, required: true, label: "Name" }),
    description: field({ type: String, optional: true, label: "Description" }),
    deal_type: field({ type: String, enum: ['new_business', 'existing_business', 'renewal', 'upsell', 'cross_sell'], default: 'new_business', label: "Deal Type" }),
    value: field({ type: Number, optional: true, label: "Value" }),
    currency: field({ type: String, optional: true, label: "Currency" }),
    expected_revenue: field({ type: Number, optional: true, label: "Expected Revenue" }),
    probability: field({ type: Number, optional: true, min: 0, max: 100, label: "Probability" }),
    expected_close_date: field({ type: Date, optional: true, label: "Expected Close Date" }),
    actual_close_date: field({ type: Date, optional: true, label: "Actual Close Date" }),
    owner_id: field({ type: Schema.Types.ObjectId, ref: 'users', required: true, index: true, label: "Owner ID" }), 
    team_id: field({ type: Schema.Types.ObjectId, ref: 'teams', optional: true, index: true, label: "Team ID" }),    
    company_id: field({ type: Schema.Types.ObjectId, ref: 'companies', optional: true, index: true, label: "Company ID" }),
    contact_ids: field({ type: [Schema.Types.ObjectId], ref: 'customers', optional: true, index: true, label: "Contact IDs" }),
    source: field({ type: String, optional: true, label: "Source" }),
    lost_reason: field({ type: String, optional: true, label: "Lost Reason" }),
    priority: field({ type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium', label: "Priority" }),
    customFieldsData: field({ type: [customFieldSchema], optional: true, label: "Custom Fields Data" }),
    created_by: field({ type: Schema.Types.ObjectId, ref: 'users', optional: true, label: "Created By" }), 
  }, { timestamps: true }), 
  'erxes_deals' // Cache key
);

// Index for common queries
dealSchema.index({ workspace_id: 1, pipeline_id: 1, stage_id: 1 });
dealSchema.index({ workspace_id: 1, owner_id: 1 });
// Consider an index for name if deals are often searched by name within a workspace
dealSchema.index({ workspace_id: 1, name: 1 });
