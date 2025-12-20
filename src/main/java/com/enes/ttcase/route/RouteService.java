package com.enes.ttcase.route;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {

    private RouteFinder routeFinder;

    public List<Route> searchRoute(FindRouteRequest request) {
        return routeFinder.findRoute(request);
    }
}
