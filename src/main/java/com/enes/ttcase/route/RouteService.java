package com.enes.ttcase.route;

import com.enes.ttcase.location.LocationDto;
import com.enes.ttcase.location.LocationService;
import com.enes.ttcase.transportation.TransportationDto;
import com.enes.ttcase.transportation.TransportationService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.ZoneId;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ExecutorService;

@Service
public class RouteService {

    private final TransportationService transportationService;
    private final LocationService locationService;
    private final RouteFinder routeFinder;
    private final ExecutorService executor;

    public RouteService(TransportationService transportationService,
                        LocationService locationService,
                        RouteFinder routeFinder,
                        @Qualifier("transportationExecutorService") ExecutorService executor) {
        this.transportationService = transportationService;
        this.locationService = locationService;
        this.routeFinder = routeFinder;
        this.executor = executor;
    }

    public List<Route> searchRoutes(SearchRouteRequest request) {
        if (request.originLocationCode().equals(request.destinationLocationCode())) {
            throw new IllegalArgumentException("Origin code and Destination code are the same");
        }

        LocationDto origin = locationService.findByLocationCode(request.originLocationCode());
        LocationDto destination = locationService.findByLocationCode(request.destinationLocationCode());
        Set<TransportationDto> transportations = fetchTransportations(origin.city(), destination.city(), request.date());

        RouteFindContext context = new RouteFindContext(
                origin,
                destination,
                transportations
        );

        return routeFinder.findRoutes(context);
    }

    private Set<TransportationDto> fetchTransportations(String originCity, String destinationCity, Instant date) {
        DayOfWeek operatingDay = date.atZone(ZoneId.systemDefault()).getDayOfWeek();
        return transportationService.findAllByCitiesAndOperatingDay(List.of(originCity, destinationCity), operatingDay);
    }
}
