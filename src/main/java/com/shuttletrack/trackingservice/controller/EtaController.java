package com.shuttletrack.trackingservice.controller;

import com.shuttletrack.trackingservice.model.Shuttle;
import com.shuttletrack.trackingservice.model.Stop;
import com.shuttletrack.trackingservice.service.ShuttleService;
import com.shuttletrack.trackingservice.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tracking")
public class EtaController {

    @Autowired
    private ShuttleService shuttleService;

    @Autowired
    private RouteService routeService;

    private static final double AVERAGE_SPEED_KMH = 20.0;
    private static final double EARTH_RADIUS_KM = 6371.0;

    // Distance under which we consider the shuttle to have "arrived" at the stop.
    // 0.15 km = 150 meters — accounts for GPS drift so it doesn't require an exact match.
    private static final double ARRIVED_THRESHOLD_KM = 0.15;

    // GET /tracking/eta?stopId=stop-A1&routeId=route-A
    @GetMapping("/eta")
    public ResponseEntity<Map<String, Object>> getEta(
            @RequestParam String stopId,
            @RequestParam String routeId) {

        List<Shuttle> shuttles = shuttleService.getAllShuttles();

        Stop stop = routeService.getStopById(stopId);

        if (stop == null) {
            return ResponseEntity.notFound().build();
        }

        double stopLat = stop.getLatitude().doubleValue();
        double stopLon = stop.getLongitude().doubleValue();

        // Find the NEAREST eligible shuttle on this route, not just the first match.
        Shuttle closestShuttle = shuttles.stream()
                .filter(s -> s.getRouteId().equals(routeId))
                .filter(s -> "HAS_SPACE".equals(s.getStatus()))
                .min(Comparator.comparingDouble(s -> haversineDistance(
                        s.getLatitude().doubleValue(), s.getLongitude().doubleValue(),
                        stopLat, stopLon
                )))
                .orElse(null);

        if (closestShuttle == null) {
            return ResponseEntity.notFound().build();
        }

        double distanceKm = haversineDistance(
                closestShuttle.getLatitude().doubleValue(), closestShuttle.getLongitude().doubleValue(),
                stopLat, stopLon
        );

        Map<String, Object> response;

        if (distanceKm <= ARRIVED_THRESHOLD_KM) {
            response = Map.of(
                    "etaMinutes", 0,
                    "status", "ARRIVED",
                    "message", "Driver has arrived",
                    "shuttleId", closestShuttle.getShuttleId(),
                    "shuttleStatus", closestShuttle.getStatus()
            );
        } else {
            double etaHours = distanceKm / AVERAGE_SPEED_KMH;
            int etaMinutes = (int) Math.round(etaHours * 60);

            response = Map.of(
                    "etaMinutes", etaMinutes,
                    "status", "EN_ROUTE",
                    "shuttleId", closestShuttle.getShuttleId(),
                    "shuttleStatus", closestShuttle.getStatus()
            );
        }

        return ResponseEntity.ok(response);
    }

    private double haversineDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }
}