package com.shuttletrack.trackingservice.service;

import com.shuttletrack.trackingservice.model.Shuttle;
import com.shuttletrack.trackingservice.repository.ShuttleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ShuttleService {

    @Autowired
    private ShuttleRepository shuttleRepository;

    // Get all shuttles
    public List<Shuttle> getAllShuttles() {
        return shuttleRepository.findAll();
    }

    // Get one shuttle by ID
    public Optional<Shuttle> getShuttleById(UUID shuttleId) {
        return shuttleRepository.findById(shuttleId);
    }

    // Update shuttle status (HAS_SPACE or FULL)
    public Shuttle updateShuttleStatus(UUID shuttleId, String status) {
        Shuttle shuttle = shuttleRepository.findById(shuttleId)
                .orElseThrow(() -> new RuntimeException("Shuttle not found"));
        shuttle.setStatus(status);
        shuttle.setLastUpdated(LocalDateTime.now());
        return shuttleRepository.save(shuttle);
    }

    // Update shuttle's GPS location
    public Shuttle updateShuttleLocation(UUID shuttleId, java.math.BigDecimal latitude, java.math.BigDecimal longitude) {
        Shuttle shuttle = shuttleRepository.findById(shuttleId)
                .orElseThrow(() -> new RuntimeException("Shuttle not found"));
        shuttle.setLatitude(latitude);
        shuttle.setLongitude(longitude);
        shuttle.setLastUpdated(LocalDateTime.now());
        return shuttleRepository.save(shuttle);
    }
}