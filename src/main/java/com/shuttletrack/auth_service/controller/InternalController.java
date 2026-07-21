package com.shuttletrack.auth_service.controller;

import com.shuttletrack.auth_service.entity.User;
import com.shuttletrack.auth_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
public class InternalController {

    private final UserRepository userRepository;

    @Value("${internal.api.key}")
    private String internalApiKey;

    public InternalController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UUID>> getAllUserIds(
            @RequestHeader(value = "X-Internal-Api-Key", required = false) String providedKey
    ) {
        if (providedKey == null || !providedKey.equals(internalApiKey)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<UUID> ids = userRepository.findAll().stream()
                .map(User::getUserId)
                .toList();
        return ResponseEntity.ok(ids);
    }
}