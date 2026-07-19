package com.shuttletrack.trackingservice.controller;

import com.shuttletrack.trackingservice.model.Shuttle;
import com.shuttletrack.trackingservice.model.Stop;
import com.shuttletrack.trackingservice.service.ShuttleService;
import com.shuttletrack.trackingservice.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // GET /tracking/eta?stopId=stop-A1&routeId=route-A
    @GetMapping("/eta")
    public ResponseEntity<Map<String, Object>> getEta(
            @RequestParam String stopId,
            @RequestParam String routeId) {

        List<Shuttle> shuttles = shuttleService.getAllShuttles();

        Shuttle closestShuttle = shuttles.stream()
                .filter(s -> s.getRouteId().equals(routeId))
                .filter(s -> "HAS_SPACE".equals(s.getStatus()))
                .findFirst()
                .orElse(null);

        if (closestShuttle == null) {
            return ResponseEntity.notFound().build();
        }

        Stop stop = routeService.getStopById(stopId);

        if (stop == null) {
            return ResponseEntity.notFound().build();
        }

        double distanceKm = haversineDistance(
                closestShuttle.getLatitude().doubleValue(), closestShuttle.getLongitude().doubleValue(),
                stop.getLatitude().doubleValue(), stop.getLongitude().doubleValue()
        );

        double etaHours = distanceKm / AVERAGE_SPEED_KMH;
        int etaMinutes = (int) Math.round(etaHours * 60);

        Map<String, Object> response = Map.of(
                "etaMinutes", etaMinutes,
                "shuttleId", closestShuttle.getShuttleId(),
                "status", closestShuttle.getStatus()
        );

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