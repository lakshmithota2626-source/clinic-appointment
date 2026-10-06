package com.hackathon.clinic.model;

import jakarta.persistence.*;

@Entity
@Table(name = "doctors")
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String specialization;

    @Column(nullable = false)
    private String availableDays;

    @Column(nullable = false)
    private String slots;

    @Column(nullable = false)
    private String room;

    public Doctor() {}

    public Doctor(String name, String specialization, String availableDays, String slots, String room) {
        this.name = name;
        this.specialization = specialization;
        this.availableDays = availableDays;
        this.slots = slots;
        this.room = room;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public String getAvailableDays() { return availableDays; }
    public void setAvailableDays(String availableDays) { this.availableDays = availableDays; }
    public String getSlots() { return slots; }
    public void setSlots(String slots) { this.slots = slots; }
    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }
}
