interface actionStateOk {
  ok?: boolean;
  message: string;
}
interface actionStateErr {
  error: string;
}

export interface BlogType {
  _id?: string;
  title?: string;
  shortDescription?: string;
  author?: string;
  estReadTime?: number;
  cover: {
    url: string;
    fileName: string;
    imageId: string;
  } | null;
  content?: string;
  status: "Draft" | "Published";
}

export interface PropertyType {
  _id?: string;
  propertyTitle: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  description: string;
  category: "For Sale" | "For Rent";
  propertyType: "House" | "Apartment" | "Condo";
  status: "Active" | "Pending" | "Sold";
  location: {
    addressLine1: string;
    addressLine2?: string;
    countryName: string;
    countryCode: string;
    stateName: string;
    stateCode: string;
    cityName: string;
    postalCode?: string;
  };
  features: string[];
  images: { url: string; fileName: string; imageId: string }[];
}

export type ActionStateType = actionStateOk | actionStateErr | null;
