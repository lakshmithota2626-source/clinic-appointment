package com.hackathon.clinic.repository;

import com.hackathon.clinic.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    boolean existsByDoctorIdAndAppointmentDateAndTimeSlot(Long doctorId, LocalDate date, String timeSlot);
    List<Appointment> findByPatientIdOrderByAppointmentDateDescTimeSlotAsc(Long patientId);
    List<Appointment> findAllByOrderByAppointmentDateAscTimeSlotAsc();
}
