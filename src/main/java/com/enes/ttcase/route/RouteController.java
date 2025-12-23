package com.enes.ttcase.route;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping(value = "/api/v1/routes")
class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @PostMapping("/search")
    public List<Route> searchRoutes(@Valid @RequestBody SearchRouteRequest request) throws ExecutionException, InterruptedException {
        return routeService.searchRoutes(request);
    }

}
