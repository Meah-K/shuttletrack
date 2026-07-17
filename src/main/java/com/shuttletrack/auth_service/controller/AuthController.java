package com.shuttletrack.auth_service.controller;

import com.shuttletrack.auth_service.dto.AuthResponse;
import com.shuttletrack.auth_service.dto.LoginRequest;
import com.shuttletrack.auth_service.dto.MessageResponse;
import com.shuttletrack.auth_service.dto.RegisterRequest;
import com.shuttletrack.auth_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

   @PostMapping("/register")
public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
    System.out.println("=== REGISTER ENDPOINT HIT === email: " + request.getEmail());
    try {
        authService.register(request);
        System.out.println("=== REGISTER SUCCEEDED ===");
    } catch (Exception e) {
        System.out.println("=== REGISTER FAILED WITH: " + e.getClass().getName() + " - " + e.getMessage() + " ===");
        e.printStackTrace();
        throw e;
    }
    return ResponseEntity.status(HttpStatus.CREATED)
            .body(new MessageResponse("Account created successfully"));
}

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/driver/login")
    public ResponseEntity<AuthResponse> driverLogin(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.driverLogin(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replaceFirst("^Bearer ", "");
        authService.logout(token);
        return ResponseEntity.ok(new MessageResponse("Logged out successfully"));
    }
}