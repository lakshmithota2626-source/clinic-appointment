package com.hackathon.clinic.config;

import com.hackathon.clinic.model.Doctor;
import com.hackathon.clinic.model.User;
import com.hackathon.clinic.repository.DoctorRepository;
import com.hackathon.clinic.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seed(DoctorRepository doctors, UserRepository users) {
        return args -> {
            if (doctors.count() == 0) {
                doctors.save(new Doctor(
                        "Dr. Ananya Rao", "General Physician",
                        "Monday,Tuesday,Wednesday,Thursday,Friday",
                        "09:00 AM,10:00 AM,11:00 AM,04:00 PM,05:00 PM", "Room 101"));
                doctors.save(new Doctor(
                        "Dr. Kiran Kumar", "Dermatologist",
                        "Monday,Wednesday,Friday,Saturday",
                        "10:00 AM,11:00 AM,02:00 PM,03:00 PM", "Room 202"));
                doctors.save(new Doctor(
                        "Dr. Meera Sharma", "Pediatrician",
                        "Tuesday,Thursday,Saturday",
                        "09:00 AM,10:00 AM,12:00 PM,04:00 PM", "Room 303"));
                doctors.save(new Doctor(
                        "Dr. Arjun Reddy", "Orthopedic",
                        "Monday,Tuesday,Thursday,Friday",
                        "09:00 AM,11:00 AM,02:00 PM,05:00 PM", "Room 104"));
            }
            if (!users.existsByEmailIgnoreCase("staff@clinic.local")) {
                users.save(new User("Clinic Staff", "staff@clinic.local", "staff123", "STAFF"));
            }
        };
    }
}
