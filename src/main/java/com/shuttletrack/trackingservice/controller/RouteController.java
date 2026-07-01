package com.shuttletrack.trackingservice.controller;

import com.shuttletrack.trackingservice.model.Route;
import com.shuttletrack.trackingservice.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tracking")
public class RouteController {

    @Autowired
    private RouteService routeService;

    // GET /tracking/routes
    @GetMapping("/routes")
    public List<Route> getAllRoutes() {
        return routeService.getAllRoutes();
    }
}