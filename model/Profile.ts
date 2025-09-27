import { CreationInfo } from './base/CreationInfo';

export interface Profile extends CreationInfo {
  ProfileKey: string; // Guid
  ProfileId: number; // long (PK)
  ScreenName: string;
  UserName: string; // unique
  ProfilePic: string; // cloud storage path
  Description: string; // 250 characters
}