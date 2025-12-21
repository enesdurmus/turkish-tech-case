import apiService from "../../api/apiService";
import { PaginatedRequest, PaginatedResponse } from "../../types/api";

export interface Location {
  id: string;
  name:string;
  country: string;
  city: string;
  locationCode: string;
  updatedAt: string;
  createdAt: string;
}

const API_ENDPOINT = "/v1/locations";

export const getLocations = async (params: PaginatedRequest): Promise<PaginatedResponse<Location>> => {
  // The backend response is wrapped in a 'data' object.
  const response = await apiService.get<PaginatedResponse<Location>>(API_ENDPOINT, { params });
  console.log(response)
  return response.data;
};

export const addLocation = async (location: Omit<Location, "id" | "createdAt" | "updatedAt">): Promise<Location> => {
  const response = await apiService.post<Location>(API_ENDPOINT, location);
  return response.data;
};

export const updateLocation = async (updatedLocation: Location): Promise<Location> => {
  const response = await apiService.put<Location>(`${API_ENDPOINT}/${updatedLocation.id}`, updatedLocation);
  return response.data;
};

export const deleteLocation = async (id: string): Promise<void> => {
  await apiService.delete(`${API_ENDPOINT}/${id}`);
};
