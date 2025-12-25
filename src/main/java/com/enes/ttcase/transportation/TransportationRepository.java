package com.enes.ttcase.transportation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

interface TransportationRepository extends JpaRepository<Transportation, Long> {

    @Query("""
            SELECT t
            FROM Transportation t
            JOIN FETCH t.origin o
            JOIN FETCH t.destination d
            JOIN FETCH t.operatingDays od
            WHERE od = :operatingDay
            AND o.country = :originCountry
            AND d.country = :destinationCountry
            AND t.transportationType = :transportationType
            """)
    List<Transportation> findTransportationsBetweenCountries(@Param("originCountry") String originCountry,
                                                             @Param("destinationCountry") String destinationCountry,
                                                             @Param("transportationType") TransportationType transportationType,
                                                             @Param("operatingDay") Integer operatingDay);

    @Query("""
            SELECT t
            FROM Transportation t
            JOIN FETCH t.origin o
            JOIN FETCH t.destination d
            JOIN FETCH t.operatingDays od
            WHERE od = :operatingDay
            AND o.locationCode IN (:originCode)
            AND d.locationCode IN (:destinationCodes)
            """)
    List<Transportation> findTransportationsBetweenLocationCodesAndOperatingDay(@Param("originCode") Set<String> originCodes,
                                                                                @Param("destinationCodes") Set<String> destinationCodes,
                                                                                @Param("operatingDay") Integer operatingDay);

}
