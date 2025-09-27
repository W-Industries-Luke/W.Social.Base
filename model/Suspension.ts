import { CreationInfo } from './base/CreationInfo';

export interface Suspension extends CreationInfo {
  SuspensionId: number;
  SuspensionKey: string;
  Description: string;
  StartDate: Date;
  EndDate?: Date;
}