import { Visibility } from '../enum/Visibility';
import { CreationInfo } from './base/CreationInfo';

export interface SecureUser extends CreationInfo {
  Email: string;
  Visibility: Visibility;
  MessagingRuleId: number;
  IsSuspended: boolean;
  SuspensionId?: number;
}