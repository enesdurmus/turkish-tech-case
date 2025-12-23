package com.enes.ttcase.location;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LocationService {

    private final LocationRepository repository;
    private final LocationMapper mapper;

    LocationService(LocationRepository repository,
                    LocationMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public Page<LocationDto> getAllRoutes(Pageable pageable) {
        return repository.findAll(pageable)
                .map(mapper::toDto);
    }

    public Page<String> getAllLocationCodes(Pageable pageable) {
        return repository.findAll(pageable)
                .map(Location::getLocationCode);
    }

    public LocationDto findById(Long id) {
        return mapper.toDto(repository.findById(id).orElse(null));
    }

    public LocationDto createLocation(LocationSaveRequest request) {
        Location location = new Location();
        location.setName(request.name());
        location.setCity(request.city());
        location.setCountry(request.country());
        location.setLocationCode(request.locationCode());
        return mapper.toDto(repository.save(location));
    }

    @Transactional
    public @Nullable LocationDto updateLocation(long id, @Valid LocationSaveRequest request) {
        Location location = repository.findById(id).orElseThrow(EntityNotFoundException::new);
        location.setName(request.name());
        location.setCity(request.city());
        location.setCountry(request.country());
        location.setLocationCode(request.locationCode());
        return mapper.toDto(repository.save(location));
    }

    public void deleteLocation(long id) {
        repository.deleteById(id);
    }

    public Location getReference(long id) {
        return repository.getReferenceById(id);
    }

    public LocationDto findByLocationCode(String locationCode) {
        return mapper.toDto(getReferenceByLocationCode(locationCode));
    }

    public Location getReferenceByLocationCode(String locationCode) {
        return repository.findByLocationCode(locationCode);
    }

}
