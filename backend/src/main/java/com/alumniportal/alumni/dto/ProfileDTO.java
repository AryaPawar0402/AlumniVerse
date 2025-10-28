package com.alumniportal.alumni.dto;

import lombok.Data;

@Data
public class ProfileDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String batch;
    private String about;
    private String profilePhoto;

    public ProfileDTO() {}

    public ProfileDTO(Long id, String firstName, String lastName, String email, String phone, String batch, String about, String profilePhoto) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.batch = batch;
        this.about = about;
        this.profilePhoto = profilePhoto;
    }
}