package com.enes.ttcase.location;

import jakarta.validation.constraints.NotEmpty;

public record LocationSaveRequest(
        @NotEmpty String name,
        @NotEmpty String country,
        @NotEmpty String city,
        @NotEmpty String locationCode
) {
}
