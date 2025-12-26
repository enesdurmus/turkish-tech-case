package com.enes.ttcase.route;

import com.enes.ttcase.location.LocationDto;
import com.enes.ttcase.transportation.TransportationDto;
import com.enes.ttcase.transportation.TransportationType;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

class DefaultRouteFinderTest {

    private DefaultRouteFinder sut = new DefaultRouteFinder();

    @Test
    void findRoutes_whenNoTransportationFound() {
        // given
        RouteFindContext context = new RouteFindContext(
                mock(LocationDto.class),
                mock(LocationDto.class),
                Set.of(mock(TransportationDto.class))
        );

        // when
        List<Route> actual = sut.findRoutes(context);

        // then
        assertThat(actual).isEmpty();
    }

    @Test
    void findRoutes_whenValidRouteExists() {
        // given
        LocationDto locA = mock(LocationDto.class);
        LocationDto locB = mock(LocationDto.class);
        LocationDto locC = mock(LocationDto.class);

        TransportationDto flightAB = new TransportationDto(0L, locA, locB, TransportationType.FLIGHT, Set.of(1), null, null);
        TransportationDto busBC = new TransportationDto(1L, locB, locC, TransportationType.BUS, Set.of(1), null, null);

        RouteFindContext context = new RouteFindContext(
                locA,
                locC,
                Set.of(flightAB, busBC)
        );

        // when
        List<Route> actual = sut.findRoutes(context);

        // then
        assertThat(actual).hasSize(1);
        assertThat(actual.getFirst().steps()).containsExactly(flightAB, busBC);
    }
}