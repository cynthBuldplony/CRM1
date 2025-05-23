import { Model, model } from 'mongoose';
import { IPipelineDocument, pipelineSchema } from './definitions/pipelines';
import { IModels } from '../../connectionResolver';

export interface IPipelineModel extends Model<IPipelineDocument> {
  // Add any static methods for Pipelines if needed
}

export const loadPipelineClass = (models: IModels) => {
  class Pipeline {
    // Define any static methods
  }
  pipelineSchema.loadClass(Pipeline);
  return pipelineSchema;
};
