import { propertyType } from "./app/(pages)/demo/(pages)/listings/page";

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

export interface PropertyResponse {
  _id: string;
  propertyTitle: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
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
  images: { url: string; fileName: string; imageId: string }[];
  status: "Active" | "Pending" | "Sold";
  category: "For Sale" | "For Rent";
  createdAt: string;
}

export interface BlogPostResponse {
  _id: string;
  title: string;
  shortDescription: string;
  cover: { url: string };
  createdAt: string;
}

export interface HomepageResponse {
  forRent: propertyType[];
  forSale: propertyType[];
  publishedBlogs: BlogPostResponse[];
}

export interface Availability {
  date: string;
  slots: string[];
}

export type AppointmentType = "call" | "house_touring";
export type HouseTouringType = "for_sale" | "for_rent";
export type CallReason = "selling" | "mortgage_enquiry" | "general_enquiry";

export interface AppointmentData {
  type: AppointmentType; // "call" or "house_touring"
  date: string | undefined;
  bookedTime: {
    from: string | undefined;
    to: string | undefined;
  };
  propertyId?: string; // Required for house touring
  houseTouringType?: string; // Required for house touring
  callReason?: CallReason; // Required for calls
  propertyTypeToSell?: string; // Required if callReason is "selling"
}

export interface AppointmentRequestData {
  type: AppointmentType; // "call" or "house_touring"
  date: string | undefined;
  bookedTime: {
    from: string | undefined;
    to: string | undefined;
  };
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  propertyId?: string; // Required for house touring
  houseTouringType?: string; // Required for house touring
  callReason?: CallReason; // Required for calls
  propertyTypeToSell?: string; // Required if callReason is "selling"
}

export interface blogType {
  _id: string;
  admin: string;
  title?: string;
  shortDescription?: string;
  author?: string;
  estReadTime?: number;
  cover?: {
    url?: string;
    imageId?: string;
    fileName?: string;
  };
  content?: string;
  status: "Draft" | "Published";
  createdAt: Date;
  updatedAt: Date;
}

export const APPOINTMENT_TYPES = ["call", "house_touring"] as const;
export const HOUSE_TOURING_TYPES = ["For Sale", "For Rent"] as const;
export const CALL_REASONS = [
  "selling",
  "mortgage_enquiry",
  "general_enquiry",
] as const;
export const APPOINTMENT_STATUS = [
  "upcoming",
  "completed",
  "cancelled",
  "rescheduled",
] as const;

// Define TypeScript Interfaces
interface ICustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface AppointmentResponse {
  _id: string;
  type: (typeof APPOINTMENT_TYPES)[number]; // "call" or "house_touring"
  status: (typeof APPOINTMENT_STATUS)[number]; // "upcoming", "completed", "cancelled"
  date: string;
  bookedTime: { from: string; to: string };
  customer: ICustomer;
  propertyId?: {
    location: {
      addressLine1: number;
      cityName: string;
      stateName: string;
      countryName: string;
    };
    propertyTitle: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    squareMeters: number;
  }; // Optional for calls
  houseTouringType?: (typeof HOUSE_TOURING_TYPES)[number]; // "for_sale" or "for_rent"
  callReason?: (typeof CALL_REASONS)[number]; // "selling", "mortgage_enquiry", "general_enquiry"
  propertyTypeToSell?: string; // Only for selling calls
  reschedule: {
    isRescheduled: boolean;
    previousDates: [{ date: string; bookedTime: { from: string; to: string } }];
  };
}

export const NOTIFICATION_TYPES = [
  "new_appointment",
  "new_newsletter",
] as const;

export interface NotificationResType {
  _id: string;
  recipientType: "admin" | "user"; // Specifies if it's for an admin or user
  type: (typeof NOTIFICATION_TYPES)[number]; // Type of notification
  message: string; // Notification content
  isRead: boolean; // Read status
  createdAt: Date; // Timestamp
}
