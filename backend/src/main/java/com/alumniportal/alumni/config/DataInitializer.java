package com.alumniportal.alumni.config;

import com.alumniportal.alumni.entity.Role;
import com.alumniportal.alumni.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Create default roles if they don't exist
        createRoleIfNotFound("STUDENT");
        createRoleIfNotFound("ALUMNI");
        createRoleIfNotFound("ADMIN");
    }

    private void createRoleIfNotFound(String name) {
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = new Role();
            role.setName(name);
            roleRepository.save(role);
            System.out.println("✅ Created role: " + name);
        } else {
            System.out.println("✅ Role already exists: " + name);
        }
    }
}