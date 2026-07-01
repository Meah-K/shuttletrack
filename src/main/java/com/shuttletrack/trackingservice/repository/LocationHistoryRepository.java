package com.shuttletrack.trackingservice.repository;

import com.shuttletrack.trackingservice.model.LocationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface LocationHistoryRepository extends JpaRepository<LocationHistory, UUID> {
}