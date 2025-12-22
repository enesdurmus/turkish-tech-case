package com.enes.ttcase.transportation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.DayOfWeek;
import java.util.List;

interface TransportationRepository extends JpaRepository<Transportation, Long> {

    @Query("""
            SELECT DISTINCT t
            FROM Transportation t
            JOIN t.operatingDays d
            WHERE d = :operatingDay
            AND (t.origin.city = :city
            OR t.destination.city = :city)
            """)
    List<Transportation> findAllByCityAndOperatingDay(@Param("city") String city, @Param("operatingDay") DayOfWeek operatingDay);

    @Query("""
            SELECT t
            FROM Transportation t
            JOIN t.operatingDays d
            WHERE d = :operatingDay
            AND (t.origin.city = :originCity
            OR t.destination.city = :destinationCity)
            """)
    List<Transportation> findAllBetweenCitiesAndOperatingDay(@Param("originCity") String originCity, @Param("destinationCity") String destinationCity, @Param("operatingDay") DayOfWeek operatingDay);

}
