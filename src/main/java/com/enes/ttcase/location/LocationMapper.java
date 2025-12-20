package com.enes.ttcase.location;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LocationMapper {

    LocationDto toDto(Location location);

    Location toEntity(LocationDto locationDto);
}
