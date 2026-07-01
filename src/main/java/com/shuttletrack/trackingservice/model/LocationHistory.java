package com.shuttletrack.trackingservice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "location_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "shuttle_id", nullable = false)
    private UUID shuttleId;

    @Column(name = "latitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(name = "longitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt = LocalDateTime.now();
}
