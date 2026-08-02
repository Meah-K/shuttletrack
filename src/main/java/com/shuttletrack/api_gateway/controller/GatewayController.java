package com.shuttletrack.api_gateway.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

@RestController
public class GatewayController {

    private final RestTemplate restTemplate;

    @Value("${services.auth.url}")
    private String authServiceUrl;

    @Value("${services.tracking.url}")
    private String trackingServiceUrl;

    @Value("${services.notification.url}")
    private String notificationServiceUrl;

    public GatewayController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @RequestMapping("/auth/**")
    public ResponseEntity<String> routeToAuth(HttpServletRequest request, @RequestBody(required = false) String body) {
        return forward(request, body, authServiceUrl);
    }

    @RequestMapping("/tracking/**")
    public ResponseEntity<String> routeToTracking(HttpServletRequest request, @RequestBody(required = false) String body) {
        return forward(request, body, trackingServiceUrl);
    }

    @RequestMapping("/notifications/**")
    public ResponseEntity<String> routeToNotifications(HttpServletRequest request, @RequestBody(required = false) String body) {
        return forward(request, body, notificationServiceUrl);
    }

    private ResponseEntity<String> forward(HttpServletRequest request, String body, String targetBaseUrl) {
        System.out.println("forward() called, targetBaseUrl=" + targetBaseUrl + " uri=" + request.getRequestURI());
        String targetUrl = targetBaseUrl + request.getRequestURI();
        if (request.getQueryString() != null) {
            targetUrl += "?" + request.getQueryString();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        Object userId = request.getAttribute("userId");
        Object role = request.getAttribute("role");
        if (userId != null) headers.set("X-User-Id", userId.toString());
        if (role != null) headers.set("X-User-Role", role.toString());

        HttpEntity<String> entity = new HttpEntity<>(body, headers);
        HttpMethod method = HttpMethod.valueOf(request.getMethod());

        try {
            return restTemplate.exchange(targetUrl, method, entity, String.class);
        } catch (HttpStatusCodeException e) {
            // Downstream service responded with a real status (400, 404, 409, etc.) —
            // pass that exact status and body straight through instead of masking it as 502.
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (Exception e) {
            // A genuine gateway-level failure — connection refused, timeout, DNS, etc.
            System.out.println("Forwarding to: " + targetUrl);
            System.out.println("Exception type: " + e.getClass().getName());
            System.out.println("Exception message: " + e.getMessage());
            return ResponseEntity.status(502).body("Gateway error: " + e.getMessage());
        }
    }
}