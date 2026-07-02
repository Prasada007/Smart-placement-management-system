package com.placement.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DriveRequest {
    private Integer requestId;
    private Integer adminId;
    private LocalDateTime testDate;
    private LocalDateTime interviewDate;
    private LocalDateTime resultDate;
    private String venue;
}