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

    LocationCacheService(LocationRepository repository) {
        this.repository = repository;
    }

    @Nullable
    @Cacheable(value = "locations", key = "#locationCode")
    public Location getLocationByCode(String locationCode) {
        return repository.findByLocationCode(locationCode);
    }

    @CacheEvict(value = "locations", key = "#locationCode")
    public void evictLocation(String locationCode) {
        log.info("Evicted location with code: {}", locationCode);
    }
}
