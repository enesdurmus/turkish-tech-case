package com.enes.ttcase.route;

import com.enes.ttcase.location.LocationDto;
import com.enes.ttcase.location.LocationService;
import com.enes.ttcase.transportation.TransportationDto;
import com.enes.ttcase.transportation.TransportationService;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class RouteService {

    private final TransportationService transportationService;
    private final LocationService locationService;
    private final RouteFinder routeFinder;

    public RouteService(TransportationService transportationService,
                        LocationService locationService,
                        RouteFinder routeFinder) {
        this.transportationService = transportationService;
        this.locationService = locationService;
        this.routeFinder = routeFinder;
    }

    public List<Route> searchRoutes(SearchRouteRequest request) {
        if (request.originLocationCode().equals(request.destinationLocationCode())) {
            throw new IllegalArgumentException("Origin code and Destination code are the same");
        }

        LocationDto origin = locationService.findByLocationCode(request.originLocationCode());
        LocationDto destination = locationService.findByLocationCode(request.destinationLocationCode());
        Set<TransportationDto> transportations = fetchTransportations(origin.city(), destination.city());

        RouteFindContext context = new RouteFindContext(
                origin,
                destination,
                transportations
        );

        return routeFinder.findRoutes(context);
    }

    private Set<TransportationDto> fetchTransportations(String originCity, String destinationCity) {
        Set<TransportationDto> transportations = new HashSet<>();
        transportations.addAll(transportationService.findAllByCity(originCity));
        transportations.addAll(transportationService.findAllByCity(destinationCity));
        transportations.addAll(transportationService.findAllBetweenCities(originCity, destinationCity));
        return transportations;
    }
}
