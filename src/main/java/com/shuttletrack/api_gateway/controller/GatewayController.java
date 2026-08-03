package com.shuttletrack.api_gateway.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
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
    public ResponseEntity<String> routeToAuth(
            HttpServletRequest request,
            @RequestBody(required = false) String body) {

        return forward(request, body, authServiceUrl);
    }

    @RequestMapping("/tracking/**")
    public ResponseEntity<String> routeToTracking(
            HttpServletRequest request,
            @RequestBody(required = false) String body) {

        return forward(request, body, trackingServiceUrl);
    }

    @RequestMapping("/notifications/**")
    public ResponseEntity<String> routeToNotifications(
            HttpServletRequest request,
            @RequestBody(required = false) String body) {

        return forward(request, body, notificationServiceUrl);
    }

    private ResponseEntity<String> forward(
            HttpServletRequest request,
            String body,
            String targetBaseUrl) {

        String targetUrl = targetBaseUrl + request.getRequestURI();

        if (request.getQueryString() != null) {
            targetUrl += "?" + request.getQueryString();
        }

        System.out.println("======================================");
        System.out.println("Forwarding Request");
        System.out.println("Method : " + request.getMethod());
        System.out.println("Target : " + targetUrl);
        System.out.println("Body   : " + body);
        System.out.println("======================================");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Object userId = request.getAttribute("userId");
        Object role = request.getAttribute("role");

        if (userId != null) {
            headers.set("X-User-Id", userId.toString());
        }

        if (role != null) {
            headers.set("X-User-Role", role.toString());
        }

        HttpEntity<String> entity = new HttpEntity<>(body, headers);
        HttpMethod method = HttpMethod.valueOf(request.getMethod());

        try {

            ResponseEntity<String> response = restTemplate.exchange(
                    targetUrl,
                    method,
                    entity,
                    String.class
            );

            System.out.println("========== DOWNSTREAM RESPONSE ==========");
            System.out.println("Status : " + response.getStatusCode());
            System.out.println("Headers: " + response.getHeaders());
            System.out.println("Body   : " + response.getBody());
            System.out.println("=========================================");

            // Create a fresh response instead of returning the original one.
            return ResponseEntity
                    .status(response.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response.getBody());

        } catch (HttpStatusCodeException e) {

            System.out.println("========== DOWNSTREAM ERROR ==========");
            System.out.println("Status : " + e.getStatusCode());
            System.out.println("Body   : " + e.getResponseBodyAsString());
            System.out.println("======================================");

            return ResponseEntity
                    .status(e.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(e.getResponseBodyAsString());

        } catch (Exception e) {

            System.out.println("========== GATEWAY EXCEPTION ==========");
            e.printStackTrace();
            System.out.println("Exception Type : " + e.getClass().getName());
            System.out.println("Message        : " + e.getMessage());
            System.out.println("=======================================");

            return ResponseEntity
                    .status(502)
                    .body("Gateway error: " + e.getMessage());
        }
    }
}