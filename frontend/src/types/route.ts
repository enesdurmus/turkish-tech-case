import {Transportation} from "./transportation";

export interface Route {
    steps: Transportation[];
}

export interface SearchRouteRequest {
    originCode: string;
    destinationCode: string;
    date: string;
}

