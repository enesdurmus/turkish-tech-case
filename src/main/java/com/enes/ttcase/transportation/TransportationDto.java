package com.enes.ttcase.transportation;

import com.enes.ttcase.location.LocationDto;

import java.time.DayOfWeek;
import java.time.Instant;
import java.util.Set;

public record TransportationDto(
        long id,
        LocationDto origin,
        LocationDto destination,
        TransportationType transportationType,
        Set<DayOfWeek> operatingDays,
        Instant createdAt,
        Instant updatedAt
) {
}
