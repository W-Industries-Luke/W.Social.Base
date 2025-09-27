export enum Visibility {
  Public = "public",
  Private = "private",
  Friends = "friends"
}

export interface MessagingRule {
  MessagingRuleId: number;
  RuleName: string;
  AllowDirectMessages: boolean;
  AllowGroupMessages: boolean;
  RestrictToFriends: boolean;
  BlockedKeywords: string[];
}

export interface Suspension {
  SuspensionId: number;
  Description: string;
  StartDate: Date;
  EndDate?: Date;
}

export interface SecureUser {
  Email: string;
  Visibility: Visibility;
  MessagingRuleId: number;
  IsSuspended: boolean;
  SuspensionId?: number;
}