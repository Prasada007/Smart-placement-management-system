package com.placement.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "placement_drives")
public class PlacementDrive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;

    @Column(name = "test_date")
    private LocalDate testDate;

    @Column(name = "interview_date")
    private LocalDate interviewDate;

    @Column(name = "result_date")
    private LocalDate resultDate;

    private String venue;

    private String status = "UPCOMING";

    @OneToMany(mappedBy = "drive", cascade = CascadeType.ALL)
    private List<Application> applications;
}