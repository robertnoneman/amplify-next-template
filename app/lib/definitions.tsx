// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
  };
  
  export type Customer = {
    id: string;
    name: string;
    email: string;
    image_url: string;
  };
  
  export type Invoice = {
    id: string;
    customer_id: string;
    amount: number;
    date: string;
    // In TypeScript, this is called a string union type.
    // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
    status: 'pending' | 'paid';
  };
  
  export type Revenue = {
    month: string;
    revenue: number;
  };
  
  export type LatestInvoice = {
    id: string;
    name: string;
    image_url: string;
    email: string;
    amount: string;
  };
  
  // The database returns a number for amount, but we later format it to a string with the formatCurrency function
  export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
    amount: number;
  };
  
  export type InvoicesTable = {
    id: string;
    customer_id: string;
    name: string;
    email: string;
    image_url: string;
    date: string;
    amount: number;
    status: 'pending' | 'paid';
  };
  
  export type CustomersTableType = {
    id: string;
    name: string;
    email: string;
    image_url: string;
    total_invoices: number;
    total_pending: number;
    total_paid: number;
  };
  
  export type FormattedCustomersTable = {
    id: string;
    name: string;
    email: string;
    image_url: string;
    total_invoices: number;
    total_pending: string;
    total_paid: string;
  };
  
  export type CustomerField = {
    id: string;
    name: string;
  };
  
  export type InvoiceForm = {
    id: string;
    customer_id: string;
    amount: number;
    status: 'pending' | 'paid';
  };

  export interface LocationData {
    id: string;
    name: string;
    address: string;
  }

  export interface RobDayLogActivityProps {
    // activityInstance: Schema["ActivityInstance"]["type"];
    activityInstanceId: string;
    activityInstanceDisplayName: string;
    activityInstanceNotes: string[];
    activityInstanceRating: number;
    activityInstanceCost: number;
    images: string[];
    // locations: Schema["Location"]["type"][];
    // location: LocationData;
    locationData: LocationData;
    // location: string;
    // locationId: string;
    imageUrls: string[];
    status: "Planned" | "InProgress" | "Paused" | "Completed";
    // populateActivityInstance: (activityInstance: Schema["ActivityInstance"]["type"]) => void;
  }

  export interface RobDayLogBaseActivityProps {
    activityId: string;
    activityName: string;
    activityDescription: string;
    activityCategories: string[];
    activityImageUrl: string;
  }

  export type TodoProps = {
    id: string;
    content: string;
    isDone: boolean;
    status: "Todo" | "InProgress" | "Completed";
  }

  export type RobdayLogProps = {
    robdayLogId: string;
    status: "Upcoming" | "Started" | "Completed";
    robdayLogDate: string;
    robdayLogNumber: number;
    notes: string[];
    robdayLogWeather: string;
    robdayLogTemperature: number;
    rating: number;
    cost: number;
    duration: number;
    startTime: number;
    endTime: number;
    totalTime: number;
    locationData: LocationData[];
    baseActivities: RobDayLogBaseActivityProps[];
    aiProps: RobDayLogActivityProps[];
    urlsDict: Record<string, string>;
  }

  export type WeatherProps = {
    temperature: number;
    conditions: string;
  }