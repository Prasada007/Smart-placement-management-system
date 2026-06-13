package com.placement.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "shortlisted_candidates")
public class ShortlistedCandidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "drive_id", nullable = false)
    private PlacementDrive drive;

    private String round;

    private String result = "PENDING";
}