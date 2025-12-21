package com.enes.ttcase.route;

import java.util.List;

public interface RouteFinder {

    List<Route> findRoutes(RouteFindContext request);
}
