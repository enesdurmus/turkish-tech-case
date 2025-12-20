package com.enes.ttcase.location;

public record LocationSaveRequest(
        String name,
        String country,
        String city,
        String locationCode
) {
}
