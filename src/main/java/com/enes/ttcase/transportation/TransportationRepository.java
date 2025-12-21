package com.enes.ttcase.transportation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

interface TransportationRepository extends JpaRepository<Transportation, Long> {

    @Query("""
            SELECT t FROM Transportation t
            WHERE t.origin.city = :city
            OR t.destination.city = :city
            """)
    List<Transportation> findAllByCity(@Param("city") String city);

    @Query("""
            SELECT t FROM Transportation t
            WHERE t.origin.city = :originCity
            OR t.destination.city = :destinationCity
            """)
    List<Transportation> findAllBetweenCities(@Param("originCity") String originCity, @Param("destinationCity") String destinationCity);

}
