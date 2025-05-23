import { Model, model } from 'mongoose';
import { IActivityDocument, activitySchema } from './definitions/activities';
import { IModels } from '../../connectionResolver';

export interface IActivityModel extends Model<IActivityDocument> {
  // Add any static methods if needed
}

export const loadActivityClass = (models: IModels) => {
  class Activity {
    // Define any static methods
  }
  activitySchema.loadClass(Activity);
  return activitySchema;
};
