export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales';
  token?: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface LeadsResponse {
  leads: Lead[];
  page: number;
  pages: number;
  total: number;
}
