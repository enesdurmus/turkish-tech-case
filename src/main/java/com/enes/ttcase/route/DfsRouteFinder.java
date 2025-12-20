package com.enes.ttcase.route;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
class DfsRouteFinder implements RouteFinder {

    @Override
    public List<Route> findRoute(FindRouteRequest request) {
        return List.of();
    }
}
