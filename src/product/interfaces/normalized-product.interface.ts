export interface NormalizedProduct {
    externalId: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    availability: boolean;
    lastProviderUpdate: Date;
  }