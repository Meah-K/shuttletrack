package com.shuttletrack.api_gateway.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shuttletrack.api_gateway.dto.ErrorResponse;
import com.shuttletrack.api_gateway.security.JwtUtil;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Paths that don't need a token at all — you can't require login to log in.
    private static final String[] PUBLIC_PATHS = {
            "/auth/register", "/auth/login", "/auth/driver/login"
    };

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Preflight requests never carry auth headers — let them straight through
        // so the browser's CORS check can pass before the real request is sent.
        if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();

        // Let public auth endpoints straight through, untouched.
        for (String publicPath : PUBLIC_PATHS) {
            if (path.equals(publicPath)) {
                filterChain.doFilter(request, response);
                return;
            }
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            respondUnauthorized(response, "Missing or malformed Authorization header");
            return;
        }

        String token = authHeader.substring(7); // strip "Bearer "

        try {
            String userId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);

            // Attach identity to the request so downstream code (our own
            // controller, in the next step) can read who's calling, without
            // needing to re-parse the token itself.
            request.setAttribute("userId", userId);
            request.setAttribute("role", role);

            filterChain.doFilter(request, response);

        } catch (JwtException e) {
            respondUnauthorized(response, "Invalid or expired token");
        }
    }

    private void respondUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        ErrorResponse error = new ErrorResponse("Unauthorized", message);
        response.getWriter().write(objectMapper.writeValueAsString(error));
    }
}