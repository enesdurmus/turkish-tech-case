package com.enes.ttcase.transportation;

import com.enes.ttcase.location.LocationService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.jspecify.annotations.Nullable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.Set;
import java.util.stream.Collectors;

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

    @Transactional
    @CacheEvict(value = "transportations", allEntries = true)
    public TransportationDto createTransportation(TransportationSaveRequest request) {
        if (request.originCode().equals(request.destinationCode())) {
            throw new IllegalArgumentException("Origin code and Destination code cannot be the same");
        }

        Transportation transportation = new Transportation();
        transportation.setOrigin(locationService.getReferenceByLocationCode(request.originCode()));
        transportation.setDestination(locationService.getReferenceByLocationCode(request.destinationCode()));
        transportation.setOperatingDays(request.operatingDays());
        transportation.setTransportationType(request.transportationType());
        return mapper.toDto(repository.save(transportation));
    }

    @Transactional
    @CacheEvict(value = "transportations", allEntries = true)
    public @Nullable TransportationDto updateTransportation(long id, @Valid TransportationSaveRequest request) {
        Transportation transportation = repository.findById(id).orElseThrow(EntityNotFoundException::new);
        transportation.setOrigin(locationService.getReferenceByLocationCode(request.originCode()));
        transportation.setDestination(locationService.getReferenceByLocationCode(request.destinationCode()));
        transportation.setOperatingDays(request.operatingDays());
        transportation.setTransportationType(request.transportationType());
        return mapper.toDto(repository.save(transportation));
    }

    @CacheEvict(value = "transportations", allEntries = true)
    public void deleteTransportation(long id) {
        repository.deleteById(id);
    }

    @Cacheable(value = "transportations", key = "#originCountry + '_' + #destinationCountry + '_' + #transportationType + '_' + #operatingDay")
    public Set<TransportationDto> findTransportationsBetweenCountries(String originCountry,
                                                                      String destinationCountry,
                                                                      TransportationType transportationType,
                                                                      DayOfWeek operatingDay) {
        return repository.findTransportationsBetweenCountries(originCountry, destinationCountry, transportationType, operatingDay.ordinal())
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toSet());
    }

    @Cacheable(value = "transportations", key = "#originCodes + '_' + #destinationCodes + '_' + #operatingDay")
    public Set<TransportationDto> findTransportationsBetweenLocationCodesAndOperatingDay(Set<String> originCodes,
                                                                                         Set<String> destinationCodes,
                                                                                         DayOfWeek operatingDay) {
        return repository.findTransportationsBetweenLocationCodesAndOperatingDay(originCodes, destinationCodes, operatingDay.ordinal())
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toSet());
    }

}
