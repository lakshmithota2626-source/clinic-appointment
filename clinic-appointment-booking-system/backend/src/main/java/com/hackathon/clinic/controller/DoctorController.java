package com.hackathon.clinic.controller;

import com.hackathon.clinic.model.Doctor;
import com.hackathon.clinic.repository.DoctorRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {
    private final DoctorRepository doctors;

    public DoctorController(DoctorRepository doctors) {
        this.doctors = doctors;
    }

    @GetMapping
    public List<Doctor> all() {
        return doctors.findAll();
    }

    @PostMapping
    public Doctor create(@RequestBody Doctor doctor) {
        return doctors.save(doctor);
    }
}
