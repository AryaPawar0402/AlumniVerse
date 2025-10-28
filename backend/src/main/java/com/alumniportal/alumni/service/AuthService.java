package com.alumniportal.alumni.service;

import com.alumniportal.alumni.dto.AuthRequest;
import com.alumniportal.alumni.dto.AuthResponse;
import com.alumniportal.alumni.dto.RegisterRequest;
import com.alumniportal.alumni.entity.Profile;
import com.alumniportal.alumni.entity.Role;
import com.alumniportal.alumni.entity.User;
import com.alumniportal.alumni.repository.ProfileRepository;
import com.alumniportal.alumni.repository.RoleRepository;
import com.alumniportal.alumni.repository.UserRepository;
import com.alumniportal.alumni.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       ProfileRepository profileRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ================== REGISTER ==================
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Role role = roleRepository.findByName(req.getRole())
                .orElseThrow(() -> new RuntimeException("Role not found: " + req.getRole()));

        User user = new User();
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(role);

        User savedUser = userRepository.save(user);

        Profile profile = new Profile();
        profile.setUser(savedUser);
        profile.setFirstName(req.getFirstName());
        profile.setLastName(req.getLastName());
        profile.setEmail(savedUser.getEmail());
        profile.setPhone(req.getPhone());
        profileRepository.save(profile);

        savedUser.setProfile(profile);
        userRepository.save(savedUser);

        // Generate token with role name (JwtUtil will add ROLE_ prefix)
        String token = jwtUtil.generateToken(savedUser.getEmail(), role.getName());

        return new AuthResponse(token, "Registration successful", savedUser.getEmail(), role.getName());
    }

    // ================== LOGIN ==================
    public AuthResponse login(AuthRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + req.getEmail()));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Generate token with role name (JwtUtil will add ROLE_ prefix)
        String roleName = user.getRole().getName();
        String token = jwtUtil.generateToken(user.getEmail(), roleName);

        return new AuthResponse(token, "Login successful", user.getEmail(), roleName);
    }
}