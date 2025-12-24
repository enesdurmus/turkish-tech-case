import api from "../api/apiService";
import {Route, SearchRouteRequest} from "../types/route";

export const routeService = {
    searchRoutes: async (request: SearchRouteRequest): Promise<Route[]> => {
        const response = await api.post("/v1/routes/search", request);
        return response.data;
    },
};

