package com.enes.ttcase.transportation;

import org.springframework.stereotype.Service;

@Service
public class TransportationService {

    private final TransportationRepository transportationRepository;

    TransportationService(TransportationRepository transportationRepository) {
        this.transportationRepository = transportationRepository;
    }

}
