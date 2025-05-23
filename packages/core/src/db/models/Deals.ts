import { Model, model } from 'mongoose';
import { IDealDocument, dealSchema } from './definitions/deals';
import { IModels } from '../../connectionResolver';

export interface IDealModel extends Model<IDealDocument> {
  // Add any static methods for Deals if needed
}

export const loadDealClass = (models: IModels) => {
  class Deal {
    // Define any static methods
  }
  dealSchema.loadClass(Deal);
  return dealSchema;
};
