package com.shuttletrack.trackingservice.controller;

import com.shuttletrack.trackingservice.model.Shuttle;
import com.shuttletrack.trackingservice.service.ShuttleService;
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

        // Simple placeholder ETA calculation - refine later with real distance math
        int etaMinutes = 4;

        Map<String, Object> response = Map.of(
                "etaMinutes", etaMinutes,
                "shuttleId", closestShuttle.getShuttleId(),
                "status", closestShuttle.getStatus()
        );

        return ResponseEntity.ok(response);
    }
}