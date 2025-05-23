import { Model, model } from 'mongoose';
import { IDealProductDocument, dealProductSchema } from './definitions/deal_products';
import { IModels } from '../../connectionResolver';

export interface IDealProductModel extends Model<IDealProductDocument> {
  // Add any static methods for DealProducts if needed
}

export const loadDealProductClass = (models: IModels) => {
  class DealProduct {
    // Define any static methods
  }
  dealProductSchema.loadClass(DealProduct);
  return dealProductSchema;
};
