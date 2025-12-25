package com.enes.ttcase.location;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.jspecify.annotations.Nullable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LocationService {

    private final LocationCacheService locationCacheService;
    private final LocationRepository repository;
    private final LocationMapper mapper;

    LocationService(LocationCacheService locationCacheService,
                    LocationRepository repository,
                    LocationMapper mapper) {
        this.locationCacheService = locationCacheService;
        this.repository = repository;
        this.mapper = mapper;
    }

    public Page<LocationDto> getAllLocations(Pageable pageable) {
        return repository.findAll(pageable)
                .map(mapper::toDto);
    }

    public Page<String> getAllLocationCodes(Pageable pageable) {
        return repository.findAll(pageable)
                .map(Location::getLocationCode);
    }

    @Nullable
    public LocationDto getById(long id) {
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
    @CacheEvict(value = "locations", key = "#result.locationCode()")
    public @Nullable LocationDto updateLocation(long id, @Valid LocationSaveRequest request) {
        Location location = repository.findById(id).orElseThrow(EntityNotFoundException::new);
        location.setName(request.name());
        location.setCity(request.city());
        location.setCountry(request.country());
        location.setLocationCode(request.locationCode());
        return mapper.toDto(repository.save(location));
    }

    public void deleteLocation(long id) {
        Location location = repository.findById(id).orElseThrow(EntityNotFoundException::new);
        locationCacheService.evictLocation(location.getLocationCode());
        repository.deleteById(id);
    }

    @Nullable
    public LocationDto getByLocationCode(String locationCode) {
        return mapper.toDto(locationCacheService.getLocationByCode(locationCode));
    }

    @Nullable
    public Location getLocationEntityByCode(String locationCode) {
        return locationCacheService.getLocationByCode(locationCode);
    }

}
