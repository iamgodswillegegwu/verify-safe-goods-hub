
export interface NAFDACProduct {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
  registrationNumber: string;
  registrationDate: string;
  expiryDate?: string;
  status: string;
  verified: boolean;
  source: 'nafdac';
}

export interface NAFDACSearchRequest {
  searchQuery: string;
  limit?: number;
}

export interface NAFDACResponse {
  found: boolean;
  verified: boolean;
  confidence: number;
  source: 'nafdac';
  products: NAFDACProduct[];
  alternatives: any[];
}
