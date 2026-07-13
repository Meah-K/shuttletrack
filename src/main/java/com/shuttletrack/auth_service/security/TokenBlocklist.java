package com.shuttletrack.auth_service.security;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TokenBlocklist {

    private final Map<String, Date> blocked = new ConcurrentHashMap<>();

    public void block(String token, Date expiry) {
        blocked.put(token, expiry);
    }

    public boolean isBlocked(String token) {
        return blocked.containsKey(token);
    }

    @Scheduled(fixedRate = 3_600_000)
    public void cleanUpExpired() {
        Date now = new Date();
        blocked.entrySet().removeIf(entry -> entry.getValue().before(now));
    }
}