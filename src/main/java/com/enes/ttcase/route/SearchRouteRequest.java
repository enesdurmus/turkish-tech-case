package com.enes.ttcase.route;

import jakarta.validation.constraints.NotEmpty;

public record SearchRouteRequest(
        @NotEmpty String originLocationCode,
        @NotEmpty String destinationLocationCode
) {
}
