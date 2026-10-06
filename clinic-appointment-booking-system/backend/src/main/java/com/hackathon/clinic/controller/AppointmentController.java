package com.hackathon.clinic.controller;

import com.hackathon.clinic.dto.AppointmentRequest;
import com.hackathon.clinic.model.*;
import com.hackathon.clinic.repository.*;
import jakarta.validation.Valid;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    private final AppointmentRepository appointments;
    private final UserRepository users;
    private final DoctorRepository doctors;

    public AppointmentController(AppointmentRepository appointments,
                                  UserRepository users,
                                  DoctorRepository doctors) {
        this.appointments = appointments;
        this.users = users;
        this.doctors = doctors;
    }

    @PostMapping
    public ResponseEntity<?> book(@Valid @RequestBody AppointmentRequest request) {
        if (request.appointmentDate().isBefore(LocalDate.now())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Please choose today or a future date."));
        }

        User patient = users.findById(request.patientId()).orElse(null);
        Doctor doctor = doctors.findById(request.doctorId()).orElse(null);
        if (patient == null || doctor == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Patient or doctor not found."));
        }

        if (!isAllowedDay(doctor.getAvailableDays(), request.appointmentDate())) {
            return ResponseEntity.badRequest().body(Map.of("message",
                    "This doctor is not available on " + request.appointmentDate().getDayOfWeek().toString().toLowerCase() + "."));
        }

        List<String> slots = Arrays.stream(doctor.getSlots().split(","))
                .map(String::trim).filter(s -> !s.isBlank()).toList();
        if (!slots.contains(request.timeSlot())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Selected time slot is not available."));
        }

        if (appointments.existsByDoctorIdAndAppointmentDateAndTimeSlot(
                doctor.getId(), request.appointmentDate(), request.timeSlot())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "That time slot is already booked. Please choose another slot."));
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.appointmentDate());
        appointment.setTimeSlot(request.timeSlot());
        appointment.setReason(request.reason().trim());
        appointment.setStatus("BOOKED");

        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(appointments.save(appointment));
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "That time slot was just booked. Please choose another slot."));
        }
    }

    @GetMapping("/patient/{patientId}")
    public List<Appointment> byPatient(@PathVariable Long patientId) {
        return appointments.findByPatientIdOrderByAppointmentDateDescTimeSlotAsc(patientId);
    }

    @GetMapping
    public List<Appointment> all() {
        return appointments.findAllByOrderByAppointmentDateAscTimeSlotAsc();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String value) {
        Optional<Appointment> found = appointments.findById(id);
        if (found.isEmpty()) return ResponseEntity.notFound().build();

        String status = value.toUpperCase();
        if (!Set.of("BOOKED", "COMPLETED", "CANCELLED").contains(status)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid status."));
        }
        Appointment a = found.get();
        a.setStatus(status);
        return ResponseEntity.ok(appointments.save(a));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        Optional<Appointment> found = appointments.findById(id);
        if (found.isEmpty()) return ResponseEntity.notFound().build();
        Appointment a = found.get();
        a.setStatus("CANCELLED");
        appointments.save(a);
        return ResponseEntity.ok(Map.of("message", "Appointment cancelled."));
    }

    private boolean isAllowedDay(String availableDays, LocalDate date) {
        String day = date.getDayOfWeek().toString().substring(0, 1)
                + date.getDayOfWeek().toString().substring(1).toLowerCase();
        return Arrays.stream(availableDays.split(","))
                .map(String::trim)
                .anyMatch(d -> d.equalsIgnoreCase(day));
    }
}
