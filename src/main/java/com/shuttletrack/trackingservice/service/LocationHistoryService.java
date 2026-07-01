package com.shuttletrack.trackingservice.service;

import com.shuttletrack.trackingservice.model.LocationHistory;
import com.shuttletrack.trackingservice.repository.LocationHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class LocationHistoryService {

    @Autowired
    private LocationHistoryRepository locationHistoryRepository;

    // Log a new GPS location for a shuttle
    public LocationHistory recordLocation(UUID shuttleId, BigDecimal latitude, BigDecimal longitude) {
        LocationHistory record = new LocationHistory();
        record.setShuttleId(shuttleId);
        record.setLatitude(latitude);
        record.setLongitude(longitude);
        record.setRecordedAt(LocalDateTime.now());
        return locationHistoryRepository.save(record);
    }
}