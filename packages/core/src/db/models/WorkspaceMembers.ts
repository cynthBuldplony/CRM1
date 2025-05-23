import { Model, model } from 'mongoose';
import { IWorkspaceMemberDocument, workspaceMemberSchema } from './definitions/workspace_members';
import { IModels } from '../../connectionResolver';

export interface IWorkspaceMemberModel extends Model<IWorkspaceMemberDocument> {
  // Add any static methods if needed
}

export const loadWorkspaceMemberClass = (models: IModels) => {
  class WorkspaceMember {
    // Define any static methods
  }
  workspaceMemberSchema.loadClass(WorkspaceMember);
  return workspaceMemberSchema;
};
