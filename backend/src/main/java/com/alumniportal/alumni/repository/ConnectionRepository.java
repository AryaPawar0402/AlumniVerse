package com.alumniportal.alumni.repository;

import com.alumniportal.alumni.entity.Connection;
import com.alumniportal.alumni.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    // Check if a connection request already exists between student and alumni
    boolean existsByStudentAndAlumni(User student, User alumni);

    // Get all connections for a student with a specific status (PENDING, ACCEPTED, etc.)
    List<Connection> findByStudentAndStatus(User student, Connection.ConnectionStatus status);

    // Get all connections for an alumni with a specific status
    List<Connection> findByAlumniAndStatus(User alumni, Connection.ConnectionStatus status);

    // Optional: Find a specific connection between student and alumni regardless of status
    Optional<Connection> findByStudentAndAlumni(User student, User alumni);
}
