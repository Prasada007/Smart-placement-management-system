package com.placement.service;

import com.placement.config.FileStorageConfig;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    public String storeResume(MultipartFile file, Integer studentId) {
        // Validate file type
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null ||
                !originalFilename.toLowerCase().endsWith(".pdf")) {
            throw new RuntimeException("Only PDF files are allowed");
        }

        // Validate file size (max 2MB)
        if (file.getSize() > 2 * 1024 * 1024) {
            throw new RuntimeException("File size must be less than 2MB");
        }

        // Generate unique filename
        String filename = "student_" + studentId + "_" +
                UUID.randomUUID().toString().substring(0, 8) + ".pdf";

        try {
            Path uploadPath = Paths.get(FileStorageConfig.RESUME_UPLOAD_DIR);

            // Create directory if it doesn't exist
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath,
                    StandardCopyOption.REPLACE_EXISTING);

            return FileStorageConfig.RESUME_UPLOAD_DIR + filename;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage());
        }
    }
}