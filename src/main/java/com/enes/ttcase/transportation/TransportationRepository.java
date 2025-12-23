package com.enes.ttcase.transportation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

interface TransportationRepository extends JpaRepository<Transportation, Long> {

    @Query("""
            SELECT DISTINCT t
            FROM Transportation t
            JOIN FETCH t.origin o
            JOIN FETCH t.destination d
            JOIN FETCH t.operatingDays od
            WHERE od = :operatingDay
            AND (
                o.city IN (:cities)
                OR d.city IN (:cities)
            )
            """)
    List<Transportation> findAllByCitiesAndOperatingDay(@Param("cities") List<String> cities, @Param("operatingDay") Integer operatingDay);

}
