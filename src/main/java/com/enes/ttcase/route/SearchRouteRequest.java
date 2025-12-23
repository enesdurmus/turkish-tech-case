package com.enes.ttcase.route;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record SearchRouteRequest(
        @NotEmpty String originCode,
        @NotEmpty String destinationCode,
        @NotNull Instant date
) {
}
