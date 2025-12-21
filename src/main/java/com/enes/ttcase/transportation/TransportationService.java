package com.enes.ttcase.transportation;

import com.enes.ttcase.location.LocationService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TransportationService {

    private final TransportationRepository repository;
    private final LocationService locationService;
    private final TransportationMapper mapper;

    TransportationService(TransportationRepository repository,
                          LocationService locationService,
                          TransportationMapper mapper) {
        this.repository = repository;
        this.locationService = locationService;
        this.mapper = mapper;
    }

    public Page<TransportationDto> getAllTransportations(Pageable pageable) {
        return repository.findAll(pageable)
                .map(mapper::toDto);
    }

    public TransportationDto findById(Long id) {
        return mapper.toDto(repository.findById(id).orElse(null));
    }

    public TransportationDto createTransportation(TransportationSaveRequest request) {
        Transportation transportation = new Transportation();
        transportation.setOrigin(locationService.getReferenceByLocationCode(request.originLocationCode()));
        transportation.setDestination(locationService.getReferenceByLocationCode(request.destinationLocationCode()));
        transportation.setOperatingDays(request.operatingDays());
        transportation.setTransportationType(request.transportationType());
        return mapper.toDto(repository.save(transportation));
    }

    @Transactional
    public @Nullable TransportationDto updateTransportation(long id, @Valid TransportationSaveRequest request) {
        Transportation transportation = repository.findById(id).orElseThrow(EntityNotFoundException::new);
        transportation.setOrigin(locationService.getReferenceByLocationCode(request.originLocationCode()));
        transportation.setDestination(locationService.getReferenceByLocationCode(request.destinationLocationCode()));
        transportation.setOperatingDays(request.operatingDays());
        transportation.setTransportationType(request.transportationType());
        return mapper.toDto(repository.save(transportation));
    }

    public void deleteTransportation(long id) {
        repository.deleteById(id);
    }

    public List<TransportationDto> findAllBetweenCities(String originCity, String destinationCity) {
        return repository.findAllBetweenCities(originCity, destinationCity)
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    public List<TransportationDto> findAllByCity(String city) {
        return repository.findAllByCity(city)
                .stream()
                .map(mapper::toDto)
                .toList();
    }

}
