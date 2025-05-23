import { Model, model } from 'mongoose';
import { IDealStageDocument, dealStageSchema } from './definitions/deal_stages';
import { IModels } from '../../connectionResolver';

export interface IDealStageModel extends Model<IDealStageDocument> {
  // Add any static methods for DealStages if needed in the future
}

export const loadDealStageClass = (models: IModels) => {
  class DealStage {
    // Define any static methods for the model here if necessary
  }
  dealStageSchema.loadClass(DealStage);
  return dealStageSchema;
};
