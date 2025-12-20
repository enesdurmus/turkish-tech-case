package com.enes.ttcase.route;

import com.enes.ttcase.transportation.TransportationDto;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
class DfsRouteFinder implements RouteFinder {

    @Override
    public List<TransportationDto> findRoute(FindRouteRequest request) {
        return List.of();
    }
}
