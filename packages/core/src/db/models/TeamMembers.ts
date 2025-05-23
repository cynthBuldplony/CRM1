import { Model, model } from 'mongoose';
import { ITeamMemberDocument, teamMemberSchema } from './definitions/team_members';
import { IModels } from '../../connectionResolver';

export interface ITeamMemberModel extends Model<ITeamMemberDocument> {
  // Add any static methods if needed
}

export const loadTeamMemberClass = (models: IModels) => {
  class TeamMember {
    // Define any static methods
  }
  teamMemberSchema.loadClass(TeamMember);
  return teamMemberSchema;
};
