package com.enes.ttcase.transportation;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(name = "api/v1/transportations")
class TransportationController {

    private final TransportationService transportationService;

    TransportationController(TransportationService transportationService) {
        this.transportationService = transportationService;
    }


}
