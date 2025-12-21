package com.enes.ttcase.location;

import org.springframework.data.jpa.repository.JpaRepository;

interface LocationRepository extends JpaRepository<Location, Long> {

    Location findByLocationCode(String locationCode);
}
