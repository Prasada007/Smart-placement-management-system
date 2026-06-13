package com.placement.dto;

import lombok.Data;

@Data
public class StudentRegisterRequest {
    private String rollNumber;
    private String name;
    private String email;
    private String phone;
    private String branch;
    private Double cgpa;
    private Integer yearOfPassing;
    private String password;
}