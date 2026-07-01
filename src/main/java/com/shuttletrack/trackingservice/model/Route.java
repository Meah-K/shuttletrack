package com.shuttletrack.trackingservice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Table(name = "routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Route {

    @Id
    @Column(name = "route_id")
    private String routeId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "short_name", nullable = false)
    private String shortName;

    @Column(name = "color", nullable = false)
    private String color;

    @Column(name = "total_stops", nullable = false)
    private Integer totalStops;

    @Column(name = "loop_time_minutes", nullable = false)
    private Integer loopTimeMinutes;

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Stop> stops;
}