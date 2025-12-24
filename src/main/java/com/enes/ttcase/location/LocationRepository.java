package com.enes.ttcase.location;

import org.jspecify.annotations.Nullable;
import org.springframework.data.jpa.repository.JpaRepository;

interface LocationRepository extends JpaRepository<Location, Long> {

    @Nullable
    Location findByLocationCode(String locationCode);
}
