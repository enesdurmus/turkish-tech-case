package com.enes.ttcase.transportation;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TransportationMapper {

    TransportationDto toDto(Transportation transportation);

    Transportation toEntity(TransportationDto transportationDto);

}
