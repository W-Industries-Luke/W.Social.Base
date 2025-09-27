export interface MessagingRule {
  MessagingRuleId: number;
  RuleName: string;
  AllowDirectMessages: boolean;
  AllowGroupMessages: boolean;
  RestrictToFriends: boolean;
  BlockedKeywords: string[];
}