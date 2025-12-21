import apiService from "../../api/apiService";
import { PaginatedRequest, PaginatedResponse } from "../../types/api";
import { Location } from "../Location/locationService";

export enum TransportationType {
  FLIGHT = "FLIGHT",
  BUS = "BUS",
  SUBWAY = "SUBWAY",
  UBER = "UBER",
}

// Interface for what the backend returns
export interface Transportation {
  id: number;
  origin: Location;
  destination: Location;
  transportationType: TransportationType;
  operatingDays: number[];
  createdAt: string;
  updatedAt: string;
}

// Interface for what we send to the backend
export interface TransportationPayload {
  originCode: string;
  destinationCode: string;
  transportationType: TransportationType;
  operatingDays: number[];
}

const API_ENDPOINT = "/v1/transportations";

export const getTransportations = async (params: PaginatedRequest): Promise<PaginatedResponse<Transportation>> => {
    const response = await apiService.get<PaginatedResponse<Transportation>>(API_ENDPOINT, { params });
    console.log(response)
    return response.data;
};

export const addTransportation = async (
  payload: TransportationPayload
): Promise<Transportation> => {
  const response = await apiService.post<Transportation>(API_ENDPOINT, payload);
  return response.data;
};

export const updateTransportation = async (
  id: number,
  payload: TransportationPayload
): Promise<Transportation> => {
  const response = await apiService.put<Transportation>(    `${API_ENDPOINT}/${id}`,    payload  );
  return response.data;
};

export const deleteTransportation = async (id: number): Promise<void> => {
  await apiService.delete(`${API_ENDPOINT}/${id}`);
};
