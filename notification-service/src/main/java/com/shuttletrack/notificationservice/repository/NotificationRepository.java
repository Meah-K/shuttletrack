package com.shuttletrack.notificationservice.repository;

import com.shuttletrack.notificationservice.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    // Spring reads this name and creates the SQL automatically:
    // SELECT * FROM notif_schema.notifications
    // WHERE user_id = ?
    // ORDER BY sent_at DESC
    List<Notification> findByUserIdOrderBySentAtDesc(UUID userId);
}