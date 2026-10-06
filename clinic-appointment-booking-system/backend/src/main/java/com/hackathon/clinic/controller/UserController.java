package com.hackathon.clinic.controller;

import com.hackathon.clinic.dto.LoginRequest;
import com.hackathon.clinic.dto.RegisterRequest;
import com.hackathon.clinic.model.User;
import com.hackathon.clinic.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository users;

    public UserController(UserRepository users) {
        this.users = users;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (users.existsByEmailIgnoreCase(request.email())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email is already registered."));
        }
        String role = request.role() == null || request.role().isBlank()
                ? "PATIENT" : request.role().toUpperCase();
        if (!role.equals("PATIENT") && !role.equals("STAFF")) role = "PATIENT";

        User user = users.save(new User(request.name().trim(), request.email().trim(),
                request.password(), role));
        user.setPassword(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        return users.findByEmailIgnoreCase(request.email().trim())
                .filter(u -> u.getPassword().equals(request.password()))
                .map(u -> {
                    u.setPassword(null);
                    return ResponseEntity.ok(u);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid email or password.")));
    }
}
