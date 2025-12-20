package com.enes.ttcase.transportation;

import com.enes.ttcase.location.Location;

import java.time.Instant;

public record TransportationDto(
        long id,
        Location origin,
        Location destination,
        TransportationType transportationType,
        Instant createdAt,
        Instant updatedAt
) {
}
