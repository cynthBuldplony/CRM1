import { Model, model } from 'mongoose';
import { IEntityTagDocument, entityTagSchema } from './definitions/entity_tags';
import { IModels } from '../../connectionResolver'; // Adjust path if necessary

export interface IEntityTagModel extends Model<IEntityTagDocument> {
  // Add any static methods if needed in the future
}

export const loadEntityTagClass = (models: IModels) => { // models param might not be needed if no cross-model logic here initially
  class EntityTag {
    // Define any static methods for the model here if necessary
  }
  entityTagSchema.loadClass(EntityTag);
  return entityTagSchema;
};

// No, this is how other models are structured:
// const EntityTags = model<IEntityTagDocument, IEntityTagModel>('entity_tags', entityTagSchema);
// export default EntityTags;
// The loadClass pattern is for injecting IModels, let's stick to that for now.
