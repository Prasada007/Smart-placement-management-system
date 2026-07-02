package com.placement.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "student_id", unique = true, nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Student student;

    private String skills;

    @Column(name = "resume_path")
    private String resumePath;

    @Column(name = "internship_details")
    private String internshipDetails;

    @Column(name = "certification_score")
    private Integer certificationScore = 0;
}