export interface Location {
    id: string;
    name: string;
    country: string;
    city: string;
    locationCode: string;
    createdAt: string;
    updatedAt: string;
}

export type LocationFormData = Omit<Location, "id" | "createdAt" | "updatedAt">;
