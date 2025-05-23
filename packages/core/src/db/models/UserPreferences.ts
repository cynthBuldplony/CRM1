import { Model, model } from 'mongoose';
import { IUserPreferenceDocument, userPreferenceSchema } from './definitions/user_preferences';
import { IModels } from '../../connectionResolver';

export interface IUserPreferenceModel extends Model<IUserPreferenceDocument> {
  // Add any static methods for UserPreferences if needed
}

export const loadUserPreferenceClass = (models: IModels) => {
  class UserPreference {
    // Define any static methods
  }
  userPreferenceSchema.loadClass(UserPreference);
  return userPreferenceSchema;
};
