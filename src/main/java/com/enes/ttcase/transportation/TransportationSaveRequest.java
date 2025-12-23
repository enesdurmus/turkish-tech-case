package com.enes.ttcase.transportation;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record TransportationSaveRequest(
        @NotEmpty String originCode,
        @NotEmpty String destinationCode,
        @NotNull Set<Integer> operatingDays,
        @NotNull TransportationType transportationType
) {
}
