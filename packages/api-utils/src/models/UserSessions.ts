import { Model } from 'mongoose';
import { IUserSessionDocument } from '../definitions/user_sessions';

export interface IUserSessionModel extends Model<IUserSessionDocument> {
  // Add any static methods for UserSessions if needed in the future
}
