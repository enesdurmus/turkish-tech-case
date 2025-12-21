package com.enes.ttcase.transportation;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record TransportationSaveRequest(
        @NotEmpty String originLocationCode,
        @NotEmpty String destinationLocationCode,
        @NotNull List<Integer> operatingDays,
        @NotNull TransportationType transportationType
) {
}
