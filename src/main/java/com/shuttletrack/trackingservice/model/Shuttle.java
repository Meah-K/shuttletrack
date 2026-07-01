package com.shuttletrack.trackingservice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "shuttles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Shuttle {

    @Id
    @Column(name = "shuttle_id")
    private UUID shuttleId;

    @Column(name = "route_id", nullable = false)
    private String routeId;

    @Column(name = "driver_id")
    private UUID driverId;

    @Column(name = "status", nullable = false)
    private String status = "INACTIVE";

    @Column(name = "latitude", precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated = LocalDateTime.now();
}