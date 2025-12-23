import apiService from "../api/apiService";
import {Route, SearchRouteRequest} from "../types/route";

const API_ENDPOINT = "/v1/routes";

export const routeService = {
    searchRoutes: async (request: SearchRouteRequest): Promise<Route[]> => {
        const response = await apiService.post<Route[]>(`${API_ENDPOINT}/search`, request);
        console.log(response.data);
        return response.data;
    },
};

