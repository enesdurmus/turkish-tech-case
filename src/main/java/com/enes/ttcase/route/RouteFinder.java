package com.enes.ttcase.route;

import com.enes.ttcase.transportation.TransportationDto;

import java.util.List;

public interface RouteFinder {

    List<TransportationDto> findRoute(FindRouteRequest request);
}
