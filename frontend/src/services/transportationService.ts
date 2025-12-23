import apiService from "../api/apiService";
import {PaginatedRequest, PaginatedResponse} from "../types/api";
import {Transportation, TransportationFormData} from "../types/transportation";

const API_ENDPOINT = "/v1/transportations";

export const transportationService = {
    getAll: async (params: PaginatedRequest): Promise<PaginatedResponse<Transportation>> => {
        const response = await apiService.get<PaginatedResponse<Transportation>>(API_ENDPOINT, {params});
        return response.data;
    },

    create: async (payload: TransportationFormData): Promise<Transportation> => {
        const response = await apiService.post<Transportation>(API_ENDPOINT, payload);
        return response.data;
    },

    update: async (id: number, payload: TransportationFormData): Promise<Transportation> => {
        const response = await apiService.put<Transportation>(`${API_ENDPOINT}/${id}`, payload);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await apiService.delete(`${API_ENDPOINT}/${id}`);
    },
};

