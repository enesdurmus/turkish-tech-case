package com.enes.ttcase.transportation;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record TransportationSaveRequest(
        @NotNull long originId,
        @NotNull long destinationId,
        @NotNull List<Integer> operatingDays,
        @NotNull TransportationType transportationType
) {
}
