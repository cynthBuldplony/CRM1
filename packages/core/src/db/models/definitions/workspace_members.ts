import { Document, Schema } from 'mongoose';
import { field, schemaHooksWrapper } from './utils';

export enum WorkspaceMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MANAGER = 'manager',
  MEMBER = 'member',
  GUEST = 'guest',
}

export interface IWorkspaceMember {
  workspace_id: string;  // References Brands._id (acting as Workspace)
  user_id: string;       // References Users._id
  role: WorkspaceMemberRole;
  permissions?: any;     // JSONB in SQL, for fine-grained permissions
  team_ids?: string[];   // References Teams._id (to be created in a subsequent step)
  joined_at?: Date;
  invited_by?: string;   // References Users._id
  invitation_accepted_at?: Date;
  last_active_at?: Date;
}

export interface IWorkspaceMemberDocument extends IWorkspaceMember, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const workspaceMemberSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    workspace_id: field({ type: Schema.Types.ObjectId, ref: 'brands', required: true, index: true, label: "Workspace ID" }),
    user_id: field({ type: Schema.Types.ObjectId, ref: 'users', required: true, index: true, label: "User ID" }),
    role: field({ type: String, enum: Object.values(WorkspaceMemberRole), required: true, default: WorkspaceMemberRole.MEMBER, label: "Role" }),
    permissions: field({ type: Schema.Types.Mixed, optional: true, label: "Permissions" }),
    team_ids: field({ type: [Schema.Types.ObjectId], ref: 'teams', optional: true, label: "Team IDs" }),
    joined_at: field({ type: Date, default: Date.now, label: "Joined At" }),
    invited_by: field({ type: Schema.Types.ObjectId, ref: 'users', optional: true, label: "Invited By User ID" }),
    invitation_accepted_at: field({ type: Date, optional: true, label: "Invitation Accepted At" }),
    last_active_at: field({ type: Date, optional: true, label: "Last Active At" }),
  }, { timestamps: true }),
  'erxes_workspace_members' // Cache key
);

workspaceMemberSchema.index({ workspace_id: 1, user_id: 1 }, { unique: true });
workspaceMemberSchema.index({ workspace_id: 1, role: 1 });
// For finding all workspaces a user is in (optionally by role)
workspaceMemberSchema.index({ user_id: 1, workspace_id: 1, role: 1 });
