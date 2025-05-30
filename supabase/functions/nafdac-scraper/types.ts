
export interface NAFDACSearchRequest {
  searchQuery: string;
  limit?: number;
  filters?: Record<string, any>;
}

export interface NAFDACResponse {
  found: boolean;
  verified: boolean;
  confidence: number;
  source: string;
  products: NAFDACProduct[];
  alternatives: NAFDACProduct[];
}

export interface NAFDACProduct {
  id: string;
  name: string;
  manufacturer: string;
  registrationNumber: string;
  registrationDate: string;
  category: string;
  status: string;
  verified: boolean;
  source: string;
  imageUrl?: string;
}
