package com.hackathon.clinic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record AppointmentRequest(
        @NotNull Long patientId,
        @NotNull Long doctorId,
        @NotNull LocalDate appointmentDate,
        @NotBlank String timeSlot,
        @NotBlank String reason
) {}
