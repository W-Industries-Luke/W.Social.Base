import { CreationInfo } from './base/CreationInfo';

export interface Suspension extends CreationInfo {
  SuspensionId: number;
  Description: string;
  StartDate: Date;
  EndDate?: Date;
}