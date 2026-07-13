package com.shuttletrack.auth_service.service;

import com.shuttletrack.auth_service.dto.AuthResponse;
import com.shuttletrack.auth_service.dto.LoginRequest;
import com.shuttletrack.auth_service.dto.RegisterRequest;
import com.shuttletrack.auth_service.entity.Role;
import com.shuttletrack.auth_service.entity.User;
import com.shuttletrack.auth_service.exception.EmailAlreadyExistsException;
import com.shuttletrack.auth_service.exception.InvalidCredentialsException;
import com.shuttletrack.auth_service.repository.UserRepository;
import com.shuttletrack.auth_service.security.JwtUtil;
import com.shuttletrack.auth_service.security.TokenBlocklist;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final TokenBlocklist tokenBlocklist;

    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("An account with this email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setStudentId(request.getStudentId());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.STUDENT);

        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return buildAuthResponse(user);
    }

    public AuthResponse driverLogin(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        if (user.getRole() != Role.DRIVER) {
            throw new InvalidCredentialsException("This account is not registered as a driver");
        }

        return buildAuthResponse(user);
    }

    public void logout(String token) {
        jwtUtil.validateAndParse(token);
        tokenBlocklist.block(token, jwtUtil.extractExpiration(token));
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtUtil.generateToken(user.getUserId().toString(), user.getRole().name());

        return new AuthResponse(
                token,
                user.getUserId().toString(),
                user.getName(),
                user.getRole().name()
        );
    }
}