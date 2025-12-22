package com.enes.ttcase.transportation;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.DayOfWeek;
import java.util.Set;

public record TransportationSaveRequest(
        @NotEmpty String originCode,
        @NotEmpty String destinationCode,
        @NotNull Set<DayOfWeek> operatingDays,
        @NotNull TransportationType transportationType
) {
}
