package com.shuttletrack.business_service.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "businesses")
public class Business {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;
    private String category;
    private String distance;

    @Column(name = "near_stop")
    private String nearStop;

    private String deal;
    private Double rating;
    private String icon;
    private String color;

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDistance() { return distance; }
    public void setDistance(String distance) { this.distance = distance; }
    public String getNearStop() { return nearStop; }
    public void setNearStop(String nearStop) { this.nearStop = nearStop; }
    public String getDeal() { return deal; }
    public void setDeal(String deal) { this.deal = deal; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}