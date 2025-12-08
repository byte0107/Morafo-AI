
export enum ViewState {
  HOME = 'HOME',
  CHAT = 'CHAT',
  DIAGNOSIS = 'DIAGNOSIS',
  MARKET = 'MARKET',
  FEED = 'FEED',
  INSIGHTS = 'INSIGHTS'
}

export type Language = 'en' | 'st';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // base64
  timestamp: Date;
  isError?: boolean;
}

export interface MarketItem {
  name: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  prediction: string;
}

export interface MarketListing {
  id: string;
  item: string;
  price: string;
  location: string;
  seller: string;
  type: 'selling' | 'buying';
  time: string;
  isUserListing?: boolean; // To highlight user's own items
  isVerified?: boolean; // To show the verified badge
  contact?: string;
}

export interface FarmerProfile {
  name: string;
  farmName: string;
  district: string;
  village: string; // Added for better verification
  nationalID: string; // Added for KYC
  phone: string;
  productionType: string; // Added to know what they produce
  isVerified: boolean;
}

export interface WeatherRisk {
  type: 'Mocheso' | 'Serame' | 'Komello' | 'Pula' | 'Sefako' | 'None'; // Sesotho types
  level: 'Low' | 'Medium' | 'High' | 'Critical';
  advice: string;
  locationName?: string;
}

export interface FeedSupplier {
    id: string;
    name: string;
    district: string;
    location: string;
    brands: string[];
    phone?: string;
}
