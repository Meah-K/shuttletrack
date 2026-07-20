package com.shuttletrack.notificationservice.controller;

import com.shuttletrack.notificationservice.dto.BroadcastRequest;
import com.shuttletrack.notificationservice.model.Notification;
import com.shuttletrack.notificationservice.repository.NotificationRepository;
import com.shuttletrack.notificationservice.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository repo;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RestTemplate restTemplate;

    // Optional: Inject base URL from application.properties, fallback to Railway default
    @Value("${auth.service.url:https://shuttletrack-production-6b61.up.railway.app}")
    private String authServiceBaseUrl;

    // ──────────────────────────────────────────────────────────────────
    // GET /notifications
    // Validates JWT and returns notifications for the logged-in user
    // ──────────────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<?> getNotifications(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Unauthorized",
                    "message", "Missing token"
            ));
        }

        String token = authHeader.substring(7);
        String userIdStr;

        try {
            userIdStr = jwtUtil.extractUserId(token);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Unauthorized",
                    "message", "Invalid or expired token"
            ));
        }

        UUID userId = UUID.fromString(userIdStr);
        List<Notification> notifications = repo.findByUserIdOrderBySentAtDesc(userId);

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
    // PUT /notifications/{id}/read
    // Marks one notification as read
    // ──────────────────────────────────────────────────────────────────
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable UUID id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Unauthorized",
                    "message", "Missing token"
            ));
        }

        String token = authHeader.substring(7);
        String userIdStr;

        try {
            userIdStr = jwtUtil.extractUserId(token);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Unauthorized",
                    "message", "Invalid or expired token"
            ));
        }

        Optional<Notification> optional = repo.findById(id);

        if (optional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "error", "Not found",
                    "message", "Notification not found"
            ));
        }

        Notification notif = optional.get();

        if (!notif.getUserId().toString().equals(userIdStr)) {
            return ResponseEntity.status(403).body(Map.of(
                    "error", "Forbidden",
                    "message", "Access denied"
            ));
        }

        notif.setRead(true);
        repo.save(notif);

        return ResponseEntity.ok(Map.of(
                "notificationId", notif.getNotificationId(),
                "isRead", true
        ));
    }

    // ──────────────────────────────────────────────────────────────────
    // POST /notifications/broadcast
    // Fetches target student IDs from auth-service and saves notifications
    // ──────────────────────────────────────────────────────────────────
    @PostMapping("/broadcast")
    public ResponseEntity<?> broadcast(@RequestBody BroadcastRequest body) {

        if (body.getRouteId() == null || body.getRouteId().trim().isEmpty() ||
                body.getTitle() == null || body.getMessage() == null) {
            return ResponseEntity.status(400).body(Map.of(
                    "error", "Validation failed",
                    "details", "routeId, title, and message are required"
            ));
        }

        // Ensure base URL ends cleanly without double slashes
        String baseUrl = authServiceBaseUrl.endsWith("/") ?
                authServiceBaseUrl.substring(0, authServiceBaseUrl.length() - 1) : authServiceBaseUrl;

        String authServiceUrl = baseUrl + "/api/users/route/" + body.getRouteId();

        List<String> studentIdStrings = new ArrayList<>();

        try {
            // Retrieve response as Object array to safely extract UUID strings
            Object[] rawResponse = restTemplate.getForObject(authServiceUrl, Object[].class);

            if (rawResponse != null) {
                for (Object item : rawResponse) {
                    if (item instanceof String) {
                        studentIdStrings.add((String) item);
                    } else if (item instanceof Map) {
                        Map<?, ?> map = (Map<?, ?>) item;
                        // Checks common user ID JSON keys
                        if (map.containsKey("userId")) {
                            studentIdStrings.add(String.valueOf(map.get("userId")));
                        } else if (map.containsKey("id")) {
                            studentIdStrings.add(String.valueOf(map.get("id")));
                        }
                    }
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Service communication failed",
                    "message", "Unable to retrieve students from auth-service at (" + authServiceUrl + "): " + e.getMessage()
            ));
        }

        if (studentIdStrings.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "message", "Broadcast processed, but no students were found on route " + body.getRouteId()
            ));
        }

        // Save notification for each retrieved student
        List<Notification> notificationsToSave = new ArrayList<>();

        for (String idStr : studentIdStrings) {
            try {
                Notification notif = new Notification();
                notif.setUserId(UUID.fromString(idStr));
                notif.setTitle(body.getTitle());
                notif.setMessage(body.getMessage());
                notif.setType(body.getType() != null ? body.getType() : "GENERAL");
                notif.setAffectedRouteId(body.getRouteId());
                notif.setSentAt(LocalDateTime.now());

                notificationsToSave.add(notif);
            } catch (IllegalArgumentException e) {
                // Skips any malformed non-UUID strings safely
                System.err.println("Invalid UUID string skipped: " + idStr);
            }
        }

        if (!notificationsToSave.isEmpty()) {
            repo.saveAll(notificationsToSave);
        }

        return ResponseEntity.ok(Map.of(
                "message", "Broadcast sent to " + notificationsToSave.size() + " student(s) on route " + body.getRouteId()
        ));
    }

    // ──────────────────────────────────────────────────────────────────
    // Helper method
    // ──────────────────────────────────────────────────────────────────
    private String getTimeAgo(LocalDateTime sentAt) {

        long minutes = Duration.between(sentAt, LocalDateTime.now()).toMinutes();

        if (minutes < 1)
            return "Just now";

        if (minutes < 60)
            return minutes + " min ago";

        long hours = minutes / 60;

        if (hours < 24)
            return hours + " hour" + (hours > 1 ? "s" : "") + " ago";

        long days = hours / 24;

        return days + " day" + (days > 1 ? "s" : "") + " ago";
    }
}