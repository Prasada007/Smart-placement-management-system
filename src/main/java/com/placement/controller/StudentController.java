package com.placement.controller;

import com.placement.dto.ApiResponse;
import com.placement.dto.StudentRegisterRequest;
import com.placement.model.Student;
import com.placement.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody StudentRegisterRequest req) {
        try {
            Student student = studentService.register(req);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Student registered successfully", student));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage(), null));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(new ApiResponse(true, "Students fetched", students));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable("id") Integer id) {
        return studentService.getById(id)
                .map(s -> ResponseEntity.ok(new ApiResponse(true, "Student found", s)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Student not found", null)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable("id") Integer id,
                                              @RequestBody Student updated) {
        try {
            Student student = studentService.update(id, updated);
            return ResponseEntity.ok(new ApiResponse(true, "Student updated", student));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage(), null));
        }
    }
}
