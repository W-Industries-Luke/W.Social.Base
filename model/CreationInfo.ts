export interface CreationInfo {
  createdAt: Date;
  createdBy: string; // Typically ProfileKey
  updatedAt?: Date;
  updatedBy?: string;
}