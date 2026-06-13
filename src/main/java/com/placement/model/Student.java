package com.placement.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "roll_number", unique = true, nullable = false)
    private String rollNumber;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;

    @Column(nullable = false)
    private String branch;

    @Column(nullable = false, columnDefinition = "DECIMAL(3,2)")
    private Double cgpa;

    @Column(name = "year_of_passing", nullable = false)
    private Integer yearOfPassing;

    @Column(name = "has_backlog")
    private Boolean hasBacklog = false;

    @Column(nullable = false)
    private String password;

    @OneToOne(mappedBy = "student", cascade = CascadeType.ALL)
    private StudentProfile profile;
}