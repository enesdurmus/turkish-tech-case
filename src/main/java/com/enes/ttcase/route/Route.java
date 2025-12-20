package com.enes.ttcase.route;

import com.enes.ttcase.transportation.TransportationDto;

import java.util.List;

public record Route(
        List<TransportationDto> route
) {
}
