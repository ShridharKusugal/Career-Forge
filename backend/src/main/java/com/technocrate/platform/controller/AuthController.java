package com.technocrate.platform.controller;

import com.technocrate.platform.dto.AuthRequest;
import com.technocrate.platform.dto.AuthResponse;
import com.technocrate.platform.dto.RegisterRequest;
import com.technocrate.platform.model.User;
import com.technocrate.platform.repository.UserRepository;
import com.technocrate.platform.security.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder,
                          JwtUtils jwtUtils, UserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already registered!");
        }
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username is already taken!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        String role = request.getRole();
        if (role == null || role.trim().isEmpty()) {
            role = "STUDENT";
        } else {
            role = role.toUpperCase();
        }
        user.setRole(role);

        userRepository.save(user);
        return ResponseEntity.ok("Registration successful!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getUsernameOrEmail());
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByUsername(request.getUsernameOrEmail());
        }

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid username, email, or password!");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body("Invalid username, email, or password!");
        }

        org.springframework.security.core.userdetails.UserDetails userDetails = 
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(),
                        user.getPasswordHash(),
                        java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole()))
                );
        String token = jwtUtils.generateToken(userDetails, user.getRole());

        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        ));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify(@RequestHeader("Authorization") String tokenHeader) {
        if (tokenHeader == null || !tokenHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Token header missing or invalid format.");
        }
        String token = tokenHeader.substring(7);
        try {
            String username = jwtUtils.extractUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtUtils.validateToken(token, userDetails)) {
                Optional<User> userOpt = userRepository.findByEmail(username);
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    return ResponseEntity.ok(new AuthResponse(
                            token,
                            user.getId(),
                            user.getUsername(),
                            user.getEmail(),
                            user.getRole()
                    ));
                }
            }
        } catch (Exception e) {
            // parsing error
        }
        return ResponseEntity.status(401).body("Invalid or expired session token.");
    }

    @PostMapping("/social")
    public ResponseEntity<?> socialLogin(@RequestBody SocialAuthRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required for social authentication.");
        }
        
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
        } else {
            // Register new social user
            user = new User();
            String baseUsername = request.getUsername() != null ? request.getUsername() : "social_user";
            String uniqueUsername = baseUsername;
            int counter = 1;
            while (userRepository.findByUsername(uniqueUsername).isPresent()) {
                uniqueUsername = baseUsername + counter;
                counter++;
            }
            user.setUsername(uniqueUsername);
            user.setEmail(request.getEmail());
            user.setPasswordHash(passwordEncoder.encode("social-oauth-dummy-pass-" + Math.random()));
            user.setRole("STUDENT");
            user = userRepository.save(user);
        }
        
        org.springframework.security.core.userdetails.UserDetails userDetails = 
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(),
                        user.getPasswordHash(),
                        java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole()))
                );
        String token = jwtUtils.generateToken(userDetails, user.getRole());
        
        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        ));
    }

    public static class SocialAuthRequest {
        private String provider;
        private String username;
        private String email;
        
        public String getProvider() { return provider; }
        public void setProvider(String provider) { this.provider = provider; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}
