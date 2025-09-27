import { Visibility } from './Visibility';

export interface SecureUser {
  Email: string;
  Visibility: Visibility;
  MessagingRuleId: number;
  IsSuspended: boolean;
  SuspensionId?: number;
}