package com.shuttletrack.trackingservice.controller;

import com.shuttletrack.trackingservice.model.Shuttle;
import com.shuttletrack.trackingservice.service.ShuttleService;
import com.shuttletrack.trackingservice.service.LocationHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/tracking")
public class ShuttleController {

    @Autowired
    private ShuttleService shuttleService;

    @Autowired
    private LocationHistoryService locationHistoryService;

    // GET /tracking/shuttles
    @GetMapping("/shuttles")
    public List<Shuttle> getAllShuttles() {
        return shuttleService.getAllShuttles();
    }

    // GET /tracking/shuttles/{id}
    @GetMapping("/shuttles/{id}")
    public ResponseEntity<Shuttle> getShuttleById(@PathVariable UUID id) {
        return shuttleService.getShuttleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /tracking/shuttles/{id}/status
    @PutMapping("/shuttles/{id}/status")
    public ResponseEntity<Shuttle> updateStatus(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        Shuttle updated = shuttleService.updateShuttleStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    // POST /tracking/shuttles/{id}/location
    @PostMapping("/shuttles/{id}/location")
    public ResponseEntity<Shuttle> updateLocation(@PathVariable UUID id, @RequestBody Map<String, BigDecimal> body) {
        BigDecimal latitude = body.get("latitude");
        BigDecimal longitude = body.get("longitude");

        Shuttle updated = shuttleService.updateShuttleLocation(id, latitude, longitude);
        locationHistoryService.recordLocation(id, latitude, longitude);

        return ResponseEntity.ok(updated);
    }
}