package com.enes.ttcase.location;

import java.time.Instant;

public record LocationDto(
        long id,
        String name,
        String country,
        String city,
        String locationCode,
        Instant createdAt,
        Instant updatedAt
) {
}
