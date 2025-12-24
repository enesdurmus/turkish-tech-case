import api from "../api/apiService";
import {PaginatedRequest, PaginatedResponse} from "../types/api";
import {Transportation, TransportationFormData} from "../types/transportation";

export const transportationService = {
    getAll: async (params: PaginatedRequest): Promise<PaginatedResponse<Transportation>> => {
        const response = await api.get("/v1/transportations", {params});
        return response.data;
    },

    create: async (data: TransportationFormData): Promise<Transportation> => {
        const response = await api.post("/v1/transportations", data);
        return response.data;
    },

    update: async (id: string | number, data: TransportationFormData): Promise<Transportation> => {
        const response = await api.put(`/v1/transportations/${id}`, data);
        return response.data;
    },

    delete: async (id: string | number): Promise<void> => {
        await api.delete(`/v1/transportations/${id}`);
    },
};

