export interface ProductUpdateInput {
    where: {
      providerId_externalId: {
        providerId: string;
        externalId: string;
      };
    };
    data: {
      price: number;
      availability: boolean;
      currency: string;
      lastProviderUpdate: Date;
      isStale: boolean;
    };
  }
  
  export interface ProductHistoryInput {
    productProviderId: string;
    price: number;
    availability: boolean;
    changedAt: Date;
  }