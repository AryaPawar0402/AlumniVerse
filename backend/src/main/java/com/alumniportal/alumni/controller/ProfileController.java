package com.alumniportal.alumni.controller;

import com.alumniportal.alumni.dto.ProfileDTO;
import com.alumniportal.alumni.entity.Profile;
import com.alumniportal.alumni.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    /**
     * Get the logged-in student's profile (from JWT principal)
     */
    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ProfileDTO> getLoggedInProfile(Principal principal) {
        System.out.println("🎯 ProfileController called - Principal: " + principal);

        if (principal == null) {
            System.out.println("❌ Principal is null → Unauthorized access");
            return ResponseEntity.status(401).build();
        }
        String email = principal.getName();
        System.out.println("🎯 Getting profile for: " + email);

        try {
            ProfileDTO profile = profileService.getProfileByEmail(email);
            System.out.println("✅ Profile found/created: " + profile.getFirstName() + " " + profile.getLastName());
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            System.out.println("❌ Error getting profile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Update the logged-in student's profile
     */
    @PutMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ProfileDTO> updateLoggedInProfile(@RequestBody ProfileDTO updatedProfile, Principal principal) {
        System.out.println("🎯 Update ProfileController called - Principal: " + principal);

        if (principal == null) {
            System.out.println("❌ Principal is null → Unauthorized access");
            return ResponseEntity.status(401).build();
        }
        String email = principal.getName();
        System.out.println("🎯 Updating profile for: " + email);
        System.out.println("🎯 Update data: " + updatedProfile);

        try {
            ProfileDTO updated = profileService.updateProfileByEmail(email, updatedProfile);
            System.out.println("✅ Profile updated successfully: " + updated.getFirstName() + " " + updated.getLastName());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.out.println("❌ Error updating profile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // Add test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        System.out.println("🎯 TEST ENDPOINT HIT - Backend is working!");
        return ResponseEntity.ok("Backend is working!");
    }
}