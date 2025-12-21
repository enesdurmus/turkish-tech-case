package com.enes.ttcase.route;

import com.enes.ttcase.location.LocationDto;
import com.enes.ttcase.transportation.TransportationDto;

import java.util.Set;

public record RouteFindContext(
        LocationDto origin,
        LocationDto destination,
        Set<TransportationDto> transportations
) {
}
