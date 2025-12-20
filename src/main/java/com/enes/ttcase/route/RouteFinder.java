package com.enes.ttcase.route;

import java.util.List;

public interface RouteFinder {

    List<Route> findRoute(FindRouteRequest request);
}
