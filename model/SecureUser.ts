import { Visibility } from '../enum/Visibility';
import { CreationInfo } from './base/CreationInfo';

export interface SecureUser extends CreationInfo {
  SecureUserId: number;
  SecureUserKey: string;
  Email: string;
  Visibility: Visibility;
  MessagingRuleId: number;
  IsSuspended: boolean;
  SuspensionId?: number;
}