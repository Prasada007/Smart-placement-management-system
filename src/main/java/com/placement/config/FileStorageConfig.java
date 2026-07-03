package com.placement.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class FileStorageConfig {
    // Folder where resumes will be saved on your server
    public static final String RESUME_UPLOAD_DIR;

    static {
        String uploadDir = System.getProperty("UPLOAD_DIR");
        if (uploadDir == null) {
            uploadDir = System.getenv("UPLOAD_DIR");
        }
        if (uploadDir == null || uploadDir.trim().isEmpty()) {
            uploadDir = "/home/prasad/spms-resumes/";
        }
        if (!uploadDir.endsWith("/")) {
            uploadDir += "/";
        }
        RESUME_UPLOAD_DIR = uploadDir;
    }
}