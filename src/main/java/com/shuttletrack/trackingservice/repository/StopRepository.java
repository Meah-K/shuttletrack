package com.shuttletrack.trackingservice.repository;

import com.shuttletrack.trackingservice.model.Stop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StopRepository extends JpaRepository<Stop, String> {
}