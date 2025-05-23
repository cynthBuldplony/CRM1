export interface IOrganization {
  name: string;
  subdomain: string;
  ownerId: string;
  plan: string;
  expiryDate: string;
  icon: string;
  // teamMembersLimit: number; // Removed
  interval: string;
  charge: any;
  size?: string; // Added

  logo?: string;
  favicon?: string;
  iconColor?: string;
  description?: string;
  dnsStatus?: string;
  backgroundColor?: string;
  isWhiteLabel?: boolean;
  domain?: string;
  textColor?: string;
  lastActiveDate?: Date;
  cronLastExecutedDate?: any;
  createdAt?: Date;
  updatedAt?: Date; // Added
  promoCodes?: string[];
  partnerKey?: string;
  awsSesAccountStatus?: string;

  // New fields
  legal_name?: string;
  tax_id?: string;
  address?: any; 
  billing_address?: any;
  website?: string;
  primary_color?: string;
  secondary_color?: string;
}
