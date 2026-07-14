package com.shuttletrack.notificationservice.controller;

import com.shuttletrack.notificationservice.dto.BroadcastRequest;
import com.shuttletrack.notificationservice.model.Notification;
import com.shuttletrack.notificationservice.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.*;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository repo;

    // ──────────────────────────────────────────────────────────────────
    // GET /api/notifications
    // Returns all notifications for the logged-in student.
    // The userId is passed as a header by the API Gateway after JWT check.
    // Response matches the agreed API contract exactly.
    // ──────────────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<?> getNotifications(
            @RequestHeader(value = "X-User-Id", required = false) String userIdStr) {

        // Reject if no user ID was provided
        if (userIdStr == null || userIdStr.isBlank()) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Unauthorized",
                    "message", "Invalid or expired token"
            ));
        }

        UUID userId = UUID.fromString(userIdStr);
        List<Notification> notifications = repo.findByUserIdOrderBySentAtDesc(userId);

        // Build the response list with the exact fields the frontend expects
        List<Map<String, Object>> response = new ArrayList<>();
        for (Notification n : notifications) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("notificationId", n.getNotificationId());
            item.put("title", n.getTitle());
            item.put("message", n.getMessage());
            item.put("type", n.getType());
            item.put("isRead", n.isRead());
            item.put("sentAt", n.getSentAt().toString());
            item.put("timeAgo", getTimeAgo(n.getSentAt()));
            response.add(item);
        }

        return ResponseEntity.ok(response);
    }

    // ──────────────────────────────────────────────────────────────────
    // PUT /api/notifications/{id}/read
    // Marks one notification as read.
    // Only the user who owns the notification can mark it read.
    // ──────────────────────────────────────────────────────────────────
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable UUID id,
            @RequestHeader(value = "X-User-Id", required = false) String userIdStr) {

        if (userIdStr == null || userIdStr.isBlank()) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Unauthorized",
                    "message", "Invalid or expired token"
            ));
        }

        Optional<Notification> optional = repo.findById(id);

        // Return 404 if notification does not exist
        if (optional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "error", "Not found",
                    "message", "Notification not found"
            ));
        }

        Notification notif = optional.get();

        // Return 403 if this notification belongs to a different user
        if (!notif.getUserId().toString().equals(userIdStr)) {
            return ResponseEntity.status(403).body(Map.of(
                    "error", "Forbidden",
                    "message", "Access denied"
            ));
        }

        // Mark as read and save
        notif.setRead(true);
        repo.save(notif);

        // Response matches the API contract
        return ResponseEntity.ok(Map.of(
                "notificationId", notif.getNotificationId(),
                "isRead", true
        ));
    }

    // ──────────────────────────────────────────────────────────────────
    // POST /api/notifications/broadcast
    // Creates a notification for students on a given route.
    // In full production this would look up all students on the route.
    // ──────────────────────────────────────────────────────────────────
    @PostMapping("/broadcast")
    public ResponseEntity<?> broadcast(@RequestBody BroadcastRequest body) {

        // Validate required fields
        if (body.getRouteId() == null || body.getTitle() == null || body.getMessage() == null) {
            return ResponseEntity.status(400).body(Map.of(
                    "error", "Validation failed",
                    "details", "routeId, title, and message are required"
            ));
        }

        // Create the notification
        // In production: look up all user IDs on this route and create one per user
        // For now: create one with a placeholder userId for testing
        Notification notif = new Notification();
        notif.setUserId(UUID.fromString("00000000-0000-0000-0000-000000000001"));// replace with real userIds in production
        notif.setTitle(body.getTitle());
        notif.setMessage(body.getMessage());
        notif.setType(body.getType() != null ? body.getType() : "GENERAL");
        notif.setAffectedRouteId(body.getRouteId());
        notif.setSentAt(LocalDateTime.now());
        repo.save(notif);

        // Response matches the API contract
        return ResponseEntity.ok(Map.of(
                "message", "Broadcast sent to students on route " + body.getRouteId()
        ));
    }

    // ──────────────────────────────────────────────────────────────────
    // Helper method — converts a timestamp to human-readable time ago
    // e.g. "2 min ago", "1 hour ago", "3 days ago"
    // ──────────────────────────────────────────────────────────────────
    private String getTimeAgo(LocalDateTime sentAt) {
        long minutes = Duration.between(sentAt, LocalDateTime.now()).toMinutes();
        if (minutes < 1)  return "Just now";
        if (minutes < 60) return minutes + " min ago";
        long hours = minutes / 60;
        if (hours < 24)   return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
        long days = hours / 24;
        return days + " day" + (days > 1 ? "s" : "") + " ago";
    }
}