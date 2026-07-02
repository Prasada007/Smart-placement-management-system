package com.placement.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

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
    @JoinColumn(name = "request_id", nullable = false)
    private PlacementRequest request;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;

    @Column(name = "test_date")
    private LocalDateTime testDate;

    @Column(name = "interview_date")
    private LocalDateTime interviewDate;

    @Column(name = "result_date")
    private LocalDateTime resultDate;

    private String venue;

    private String status = "UPCOMING";

    @JsonIgnore
    @OneToMany(mappedBy = "drive", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Application> applications;
}