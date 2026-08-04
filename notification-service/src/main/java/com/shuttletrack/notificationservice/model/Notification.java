package com.shuttletrack.notificationservice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications") // maps to notif_schema.notifications
@Data           // Lombok: generates all getters and setters for you
@NoArgsConstructor  // Lombok: generates empty constructor
@AllArgsConstructor // Lombok: generates constructor with all fields
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "notification_id")
    private UUID notificationId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private String type; // DELAY, STATUS, or GENERAL

    @Column(name = "affected_route_id")
    private String affectedRouteId;

    @Column(name = "is_read")
    private boolean isRead = false;

    @Column(name = "sent_at")
    private LocalDateTime sentAt = LocalDateTime.now();
}