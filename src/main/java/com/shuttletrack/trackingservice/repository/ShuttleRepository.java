package com.shuttletrack.trackingservice.repository;

import com.shuttletrack.trackingservice.model.Shuttle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ShuttleRepository extends JpaRepository<Shuttle, UUID> {
}