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

    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper;

    LocationService(LocationRepository locationRepository,
                    LocationMapper locationMapper) {
        this.locationRepository = locationRepository;
        this.locationMapper = locationMapper;
    }

    public Page<LocationDto> getAllRoutes(Pageable pageable) {
        return locationRepository.findAll(pageable)
                .map(locationMapper::toDto);
    }

    public LocationDto findById(Long id) {
        return locationMapper.toDto(locationRepository.findById(id).orElse(null));
    }

    public LocationDto createLocation(LocationSaveRequest request) {
        Location location = new Location();
        location.setName(request.name());
        location.setCity(request.city());
        location.setCountry(request.country());
        location.setLocationCode(request.locationCode());
        return locationMapper.toDto(locationRepository.save(location));
    }

    @Transactional
    public @Nullable LocationDto updateLocation(long id, @Valid LocationSaveRequest request) {
        Location location = locationRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        location.setName(request.name());
        location.setCity(request.city());
        location.setCountry(request.country());
        location.setLocationCode(request.locationCode());
        return locationMapper.toDto(locationRepository.save(location));
    }

    public void deleteLocation(long id) {
        locationRepository.deleteById(id);
    }

    public Location getReference(long id) {
        return locationRepository.getReferenceById(id);
    }
}
