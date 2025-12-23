import {Location} from "./location";

export enum TransportationType {
    FLIGHT = "FLIGHT",
    BUS = "BUS",
    SUBWAY = "SUBWAY",
    UBER = "UBER",
}

export interface Transportation {
    id: number;
    origin: Location;
    destination: Location;
    transportationType: TransportationType;
    operatingDays: number[];
    createdAt: string;
    updatedAt: string;
}

export interface TransportationFormData {
    originCode: string;
    destinationCode: string;
    transportationType: TransportationType;
    operatingDays: number[];
}

