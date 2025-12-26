package com.enes.ttcase.transportation;

import com.enes.ttcase.location.Location;
import com.enes.ttcase.location.LocationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.assertArg;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransportationServiceTest {

    @Mock
    private TransportationRepository repository;

    @Mock
    private LocationService locationService;

    @Mock
    private TransportationMapper mapper;

    private TransportationService sut;

    @BeforeEach
    void setUp() {
        sut = new TransportationService(repository, locationService, mapper);
    }

    @Test
    void getAllTransportations_ShouldReturnPagedTransportations() {
        // given
        PageRequest pageable = mock(PageRequest.class);
        Transportation transportation = mock(Transportation.class);
        TransportationDto transportationDto = mock(TransportationDto.class);

        when(repository.findAll(pageable))
                .thenReturn(new PageImpl<>(List.of(transportation)));
        when(mapper.toDto(transportation)).thenReturn(transportationDto);

        // when
        Page<TransportationDto> actual = sut.getAllTransportations(pageable);

        // then
        assertThat(actual.getTotalElements()).isEqualTo(1);
        assertThat(actual.getContent().getFirst()).isEqualTo(transportationDto);
    }

    @Test
    void findById_ShouldReturnTransportationDto_WhenTransportationExists() {
        // given
        Long transportationId = 1L;
        Transportation transportation = mock(Transportation.class);
        TransportationDto transportationDto = mock(TransportationDto.class);

        when(repository.findById(transportationId)).thenReturn(java.util.Optional.of(transportation));
        when(mapper.toDto(transportation)).thenReturn(transportationDto);

        // when
        TransportationDto actual = sut.findById(transportationId);

        // then
        assertThat(actual).isEqualTo(transportationDto);
    }

    @Test
    void createTransportation_ShouldThrowException_WhenOriginAndDestinationAreSame() {
        // given
        String locationCode = "LOC123";
        TransportationSaveRequest request = new TransportationSaveRequest(
                locationCode,
                locationCode,
                Set.of(1, 2, 3),
                TransportationType.BUS
        );

        // when / then
        try {
            sut.createTransportation(request);
        } catch (IllegalArgumentException e) {
            assertThat(e.getMessage()).isEqualTo("Origin code and Destination code cannot be the same");
        }
    }

    @Test
    void createTransportation_ShouldCreateAndReturnTransportationDto() {
        // given
        String originCode = "LOC123";
        String destinationCode = "LOC456";
        TransportationSaveRequest request = new TransportationSaveRequest(
                originCode,
                destinationCode,
                Set.of(1, 2, 3),
                TransportationType.BUS
        );

        Transportation transportation = mock(Transportation.class);
        TransportationDto transportationDto = mock(TransportationDto.class);

        when(locationService.getReferenceByLocationCode(originCode)).thenReturn(mock(Location.class));
        when(locationService.getReferenceByLocationCode(destinationCode)).thenReturn(mock(Location.class));
        when(repository.save(assertArg(args -> {
            assertThat(args.getOrigin()).isNotNull();
            assertThat(args.getDestination()).isNotNull();
            assertThat(args.getOperatingDays()).containsExactlyInAnyOrderElementsOf(request.operatingDays());
            assertThat(args.getTransportationType()).isEqualTo(request.transportationType());
        }))).thenReturn(transportation);
        when(mapper.toDto(transportation)).thenReturn(transportationDto);

        // when
        TransportationDto actual = sut.createTransportation(request);

        // then
        assertThat(actual).isEqualTo(transportationDto);
    }

    @Test
    void deleteTransportation_ShouldInvokeRepositoryDeleteById() {
        // given
        long transportationId = 1L;

        // when
        sut.deleteTransportation(transportationId);

        // then
        verify(repository).deleteById(transportationId);
    }

    @Test
    void findTransportationsBetweenCountries_ShouldReturnTransportationDtos() {
        // given
        String originCountry = "CountryA";
        String destinationCountry = "CountryB";
        TransportationType transportationType = TransportationType.FLIGHT;
        java.time.DayOfWeek operatingDay = java.time.DayOfWeek.MONDAY;

        Transportation transportation = mock(Transportation.class);
        TransportationDto transportationDto = mock(TransportationDto.class);

        when(repository.findTransportationsBetweenCountries(originCountry, destinationCountry, transportationType, operatingDay.ordinal()))
                .thenReturn(List.of(transportation));
        when(mapper.toDto(transportation)).thenReturn(transportationDto);

        // when
        Set<TransportationDto> actual = sut.findTransportationsBetweenCountries(originCountry, destinationCountry, transportationType, operatingDay);

        // then
        assertThat(actual).containsExactly(transportationDto);
    }

    @Test
    void findTransportationsBetweenLocationCodesAndOperatingDay_ShouldReturnTransportationDtos() {
        // given
        Set<String> originCodes = Set.of("LOC1", "LOC2");
        Set<String> destinationCodes = Set.of("LOC3", "LOC4");
        java.time.DayOfWeek operatingDay = java.time.DayOfWeek.FRIDAY;

        Transportation transportation = mock(Transportation.class);
        TransportationDto transportationDto = mock(TransportationDto.class);

        when(repository.findTransportationsBetweenLocationCodesAndOperatingDay(originCodes, destinationCodes, operatingDay.ordinal()))
                .thenReturn(List.of(transportation));
        when(mapper.toDto(transportation)).thenReturn(transportationDto);

        // when
        Set<TransportationDto> actual = sut.findTransportationsBetweenLocationCodesAndOperatingDay(originCodes, destinationCodes, operatingDay);

        // then
        assertThat(actual).containsExactly(transportationDto);
    }
}