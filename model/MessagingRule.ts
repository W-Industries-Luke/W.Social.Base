import { CreationInfo } from './base/CreationInfo';

export interface MessagingRule extends CreationInfo {
  MessagingRuleId: number;
  RuleName: string;
  AllowDirectMessages: boolean;
  AllowGroupMessages: boolean;
  RestrictToFriends: boolean;
  BlockedKeywords: string[];
}