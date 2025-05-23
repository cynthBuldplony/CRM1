import { Model, model } from 'mongoose';
import { ITeamDocument, teamSchema } from './definitions/teams';
import { IModels } from '../../connectionResolver';

export interface ITeamModel extends Model<ITeamDocument> {
  // Add any static methods if needed
}

export const loadTeamClass = (models: IModels) => {
  class Team {
    // Define any static methods
  }
  teamSchema.loadClass(Team);
  return teamSchema;
};
