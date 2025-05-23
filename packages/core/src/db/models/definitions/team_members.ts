import { Document, Schema } from 'mongoose';
import { field, schemaHooksWrapper } from './utils';

export enum TeamMemberRole {
  LEAD = 'lead',
  MEMBER = 'member',
}

export interface ITeamMember {
  team_id: string;   // References Teams._id
  user_id: string;   // References Users._id
  role?: TeamMemberRole;
  joined_at?: Date;
}

export interface ITeamMemberDocument extends ITeamMember, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const teamMemberSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    team_id: field({ type: Schema.Types.ObjectId, ref: 'teams', required: true, index: true, label: "Team ID" }),
    user_id: field({ type: Schema.Types.ObjectId, ref: 'users', required: true, index: true, label: "User ID" }),
    role: field({ type: String, enum: Object.values(TeamMemberRole), default: TeamMemberRole.MEMBER, label: "Role" }),
    joined_at: field({ type: Date, default: Date.now, label: "Joined At" }),
  }, { timestamps: true }),
  'erxes_team_members' // Cache key
);

teamMemberSchema.index({ team_id: 1, user_id: 1 }, { unique: true });
// Optional: Index for finding all teams for a user or all users in a team by role
teamMemberSchema.index({ user_id: 1, team_id: 1 }); 
teamMemberSchema.index({ team_id: 1, role: 1 });
