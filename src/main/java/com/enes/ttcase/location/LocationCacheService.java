package com.enes.ttcase.location;

import org.jspecify.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
class LocationCacheService {

    private static final Logger log = LoggerFactory.getLogger(LocationCacheService.class);

    private final LocationRepository repository;
    private final LocationMapper mapper;

    LocationCacheService(LocationRepository repository,
                         LocationMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Nullable
    @Cacheable(value = "locations", key = "#locationCode", unless = "#result == null")
    public LocationDto getLocationByCode(String locationCode) {
        return mapper.toDto(repository.findByLocationCode(locationCode));
    }

    @CacheEvict(value = "locations", key = "#locationCode")
    public void evictLocation(String locationCode) {
        log.info("Evicted location with code: {}", locationCode);
    }
}
