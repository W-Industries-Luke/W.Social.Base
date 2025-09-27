import { CreationInfo } from './base/CreationInfo';

export interface MessagingRule extends CreationInfo {
  MessagingRuleId: number;
  MessagingRuleKey: string;
  RuleName: string;
  AllowDirectMessages: boolean;
  AllowGroupMessages: boolean;
  RestrictToFriends: boolean;
  BlockedKeywords: string[];
}