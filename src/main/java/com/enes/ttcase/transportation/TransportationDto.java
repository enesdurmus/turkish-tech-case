package com.enes.ttcase.transportation;

import com.enes.ttcase.location.LocationDto;

import java.time.Instant;
import java.util.List;

public record TransportationDto(
        long id,
        LocationDto origin,
        LocationDto destination,
        TransportationType transportationType,
        List<Integer> operatingDays,
        Instant createdAt,
        Instant updatedAt
) {
}
