package com.enes.ttcase.route;

import com.enes.ttcase.location.LocationDto;
import com.enes.ttcase.transportation.TransportationDto;
import com.enes.ttcase.transportation.TransportationType;
import org.springframework.stereotype.Component;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
class DefaultRouteFinder implements RouteFinder {

    private static final int MAX_STEPS = 3;

    @Override
    public List<Route> findRoutes(RouteFindContext context) {
        List<Route> validRoutes = new ArrayList<>();

        Map<LocationDto, List<TransportationDto>> graph = buildGraph(context);
        Deque<SearchState> stack = new ArrayDeque<>();

        stack.push(new SearchState(context.origin(), new ArrayList<>()));

        while (!stack.isEmpty()) {
            SearchState currentState = stack.pop();
            LocationDto currentLocation = currentState.location;
            List<TransportationDto> currentPath = currentState.path;

            if (currentLocation.equals(context.destination())) {
                if (containsFlight(currentPath)) {
                    validRoutes.add(new Route(currentPath));
                }
                continue;
            }

            if (currentPath.size() >= MAX_STEPS) {
                continue;
            }

            if (graph.containsKey(currentLocation)) {
                for (TransportationDto transport : graph.get(currentLocation)) {

                    if (isVisitedInPath(currentPath, transport.destination())) {
                        continue;
                    }

                    List<TransportationDto> newPath = new ArrayList<>(currentPath);
                    newPath.add(transport);

                    stack.push(new SearchState(transport.destination(), newPath));
                }
            }
        }

        return validRoutes;
    }

    private boolean containsFlight(List<TransportationDto> path) {
        return path.stream()
                .anyMatch(t -> t.transportationType() == TransportationType.FLIGHT);
    }

    private boolean isVisitedInPath(List<TransportationDto> path, LocationDto targetLocation) {
        return path.stream()
                .anyMatch(t -> t.destination().equals(targetLocation));
    }

    private Map<LocationDto, List<TransportationDto>> buildGraph(RouteFindContext context) {
        return context.transportations()
                .stream()
                .collect(Collectors.groupingBy(TransportationDto::origin));
    }

    private record SearchState(LocationDto location, List<TransportationDto> path) {
    }
}
