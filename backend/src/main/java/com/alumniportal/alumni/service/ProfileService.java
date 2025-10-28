package com.alumniportal.alumni.service;

import com.alumniportal.alumni.dto.ProfileDTO;
import com.alumniportal.alumni.entity.Profile;
import com.alumniportal.alumni.entity.User;
import com.alumniportal.alumni.repository.ProfileRepository;
import com.alumniportal.alumni.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    // Fetch profile by email and return as DTO
    public ProfileDTO getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Profile profile = user.getProfile();

        // If profile doesn't exist, create a default one
        if (profile == null) {
            System.out.println("⚠️ Profile not found for user: " + email + ", creating default profile");
            profile = createDefaultProfile(user);
        }

        // Convert to DTO to avoid circular references
        return convertToDTO(profile);
    }

    // Update profile by email and return as DTO
    public ProfileDTO updateProfileByEmail(String email, ProfileDTO updatedProfileDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Profile profile = user.getProfile();

        // If profile doesn't exist, create one first
        if (profile == null) {
            System.out.println("⚠️ Profile not found during update, creating default profile first");
            profile = createDefaultProfile(user);
        }

        // Update fields from DTO
        profile.setFirstName(updatedProfileDTO.getFirstName());
        profile.setLastName(updatedProfileDTO.getLastName());
        profile.setBatch(updatedProfileDTO.getBatch());
        profile.setAbout(updatedProfileDTO.getAbout());
        profile.setProfilePhoto(updatedProfileDTO.getProfilePhoto());
        profile.setPhone(updatedProfileDTO.getPhone());

        Profile updatedProfile = profileRepository.save(profile);
        System.out.println("✅ Profile updated for: " + email);

        return convertToDTO(updatedProfile);
    }

    // Create default profile for user
    private Profile createDefaultProfile(User user) {
        Profile profile = new Profile();
        profile.setUser(user);
        profile.setEmail(user.getEmail());
        profile.setFirstName("First Name");
        profile.setLastName("Last Name");
        profile.setPhone("");
        profile.setAbout("");
        profile.setBatch("");
        profile.setProfilePhoto("");

        Profile savedProfile = profileRepository.save(profile);

        // Update user with the new profile
        user.setProfile(savedProfile);
        userRepository.save(user);

        System.out.println("✅ Default profile created for: " + user.getEmail());
        return savedProfile;
    }

    // Convert Profile entity to ProfileDTO
    private ProfileDTO convertToDTO(Profile profile) {
        return new ProfileDTO(
                profile.getId(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getEmail(),
                profile.getPhone(),
                profile.getBatch(),
                profile.getAbout(),
                profile.getProfilePhoto()
        );
    }

    // Convert ProfileDTO to Profile entity
    private Profile convertToEntity(ProfileDTO profileDTO) {
        Profile profile = new Profile();
        profile.setId(profileDTO.getId());
        profile.setFirstName(profileDTO.getFirstName());
        profile.setLastName(profileDTO.getLastName());
        profile.setEmail(profileDTO.getEmail());
        profile.setPhone(profileDTO.getPhone());
        profile.setBatch(profileDTO.getBatch());
        profile.setAbout(profileDTO.getAbout());
        profile.setProfilePhoto(profileDTO.getProfilePhoto());
        return profile;
    }

    // Optional: upload/update profile photo
    public ProfileDTO updateProfilePhoto(String email, MultipartFile file) {
        ProfileDTO profileDTO = getProfileByEmail(email);
        profileDTO.setProfilePhoto(file.getOriginalFilename());

        // Update the profile with new photo
        Profile profile = convertToEntity(profileDTO);
        Profile updatedProfile = profileRepository.save(profile);

        return convertToDTO(updatedProfile);
    }
}