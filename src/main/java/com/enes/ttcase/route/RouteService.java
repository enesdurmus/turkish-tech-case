package com.enes.ttcase.route;

import com.enes.ttcase.transportation.TransportationDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {

    private RouteFinder routeFinder;

    public List<TransportationDto> searchRoute(FindRouteRequest request) {
        return routeFinder.findRoute(request);
    }
}
