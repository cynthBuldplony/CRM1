import { Document, Schema } from 'mongoose';
import { field, schemaHooksWrapper } from './utils';

export interface ITeam {
  workspace_id: string;  // References Brands._id (acting as Workspace)
  name: string;
  description?: string;
  color?: string;        // Hex color
  manager_id?: string;   // References Users._id
  parent_team_id?: string; // References Teams._id (for sub-teams)
  // created_by?: string; // SQL schema for users has created_by on teams, consider for future
}

export interface ITeamDocument extends ITeam, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const teamSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    workspace_id: field({ type: Schema.Types.ObjectId, ref: 'brands', required: true, index: true, label: "Workspace ID" }),
    name: field({ type: String, required: true, label: "Name" }),
    description: field({ type: String, optional: true, label: "Description" }),
    color: field({ type: String, optional: true, label: "Color Code" }),
    manager_id: field({ type: Schema.Types.ObjectId, ref: 'users', optional: true, index: true, label: "Manager ID" }),
    parent_team_id: field({ type: Schema.Types.ObjectId, ref: 'teams', optional: true, index: true, label: "Parent Team ID" }),
    // created_by: field({ type: String, optional: true, label: "Created By" }),
  }, { timestamps: true }),
  'erxes_teams' // Cache key
);

teamSchema.index({ workspace_id: 1, name: 1 }, { unique: true });
teamSchema.index({ workspace_id: 1, parent_team_id: 1 });
