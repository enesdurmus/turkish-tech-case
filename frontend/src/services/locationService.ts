import apiService from "../api/apiService";
import {PaginatedRequest, PaginatedResponse} from "../types/api";
import {Location, LocationFormData} from "../types/location";

const API_ENDPOINT = "/v1/locations";

export const locationService = {
    getAll: async (params: PaginatedRequest): Promise<PaginatedResponse<Location>> => {
        const response = await apiService.get<PaginatedResponse<Location>>(API_ENDPOINT, {params});
        return response.data;
    },

    getAllCodes: async (params: PaginatedRequest): Promise<PaginatedResponse<string>> => {
        const response = await apiService.get<PaginatedResponse<string>>(`${API_ENDPOINT}/codes`, {params});
        return response.data;
    },

    create: async (location: LocationFormData): Promise<Location> => {
        const response = await apiService.post<Location>(API_ENDPOINT, location);
        return response.data;
    },

    update: async (id: string, location: LocationFormData): Promise<Location> => {
        const response = await apiService.put<Location>(`${API_ENDPOINT}/${id}`, location);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiService.delete(`${API_ENDPOINT}/${id}`);
    },
};

