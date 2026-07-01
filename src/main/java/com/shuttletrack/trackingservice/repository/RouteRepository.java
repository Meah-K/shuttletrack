package com.shuttletrack.trackingservice.repository;

import com.shuttletrack.trackingservice.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RouteRepository extends JpaRepository<Route, String> {
}