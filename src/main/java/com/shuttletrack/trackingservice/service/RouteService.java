package com.shuttletrack.trackingservice.service;

import com.shuttletrack.trackingservice.model.Route;
import com.shuttletrack.trackingservice.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {

    @Autowired
    private RouteRepository routeRepository;

    // Get all routes (with their stops nested)
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }
}