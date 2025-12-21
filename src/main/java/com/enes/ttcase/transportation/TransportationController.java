package com.enes.ttcase.transportation;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v1/transportations")
class TransportationController {

    private final TransportationService transportationService;

    TransportationController(TransportationService transportationService) {
        this.transportationService = transportationService;
    }

    @PostMapping
    public ResponseEntity<TransportationDto> createTransportation(@Valid @RequestBody TransportationSaveRequest request) {
        return new ResponseEntity<>(transportationService.createTransportation(request), HttpStatus.CREATED);
    }

    @GetMapping
    public Page<TransportationDto> findAll(Pageable pageable) {
        return transportationService.getAllTransportations(pageable);
    }

    @GetMapping("/{id}")
    public TransportationDto getTransportationById(@PathVariable long id) {
        return transportationService.findById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransportationDto> updateTransportation(@PathVariable long id, @Valid @RequestBody TransportationSaveRequest request) {
        return ResponseEntity.ok(transportationService.updateTransportation(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTransportation(@PathVariable long id) {
        transportationService.deleteTransportation(id);
    }

}
