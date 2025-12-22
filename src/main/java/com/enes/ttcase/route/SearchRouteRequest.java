package com.enes.ttcase.route;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record SearchRouteRequest(
        @NotEmpty String originLocationCode,
        @NotEmpty String destinationLocationCode,
        @NotNull Instant date
) {
}
