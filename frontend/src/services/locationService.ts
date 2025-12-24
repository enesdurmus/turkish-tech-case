import api from "../api/apiService";
import {PaginatedRequest, PaginatedResponse} from "../types/api";
import {Location, LocationFormData} from "../types/location";

export const locationService = {
    getAll: async (params: PaginatedRequest): Promise<PaginatedResponse<Location>> => {
        const response = await api.get("/v1/locations", {params});
        return response.data;
    },

    getAllCodes: async (params: PaginatedRequest): Promise<PaginatedResponse<string>> => {
        const response = await api.get("/v1/locations/codes", {params});
        return response.data;
    },

    create: async (data: LocationFormData): Promise<Location> => {
        const response = await api.post("/v1/locations", data);
        return response.data;
    },

    update: async (id: string, data: LocationFormData): Promise<Location> => {
        const response = await api.put(`/v1/locations/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/v1/locations/${id}`);
    },
};

