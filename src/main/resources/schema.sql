-- Smart Placement Management System
-- Database Schema

CREATE DATABASE IF NOT EXISTS spms_db;
USE spms_db;

-- 1. Admins
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'PLACEMENT_OFFICER'
);

-- 2. Students
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    branch VARCHAR(50) NOT NULL,
    cgpa DECIMAL(4,2) NOT NULL,
    year_of_passing INT NOT NULL,
    has_backlog BOOLEAN DEFAULT FALSE,
    password VARCHAR(255) NOT NULL
);

-- 3. Student Profiles
CREATE TABLE IF NOT EXISTS student_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT UNIQUE NOT NULL,
    skills TEXT,
    resume_path VARCHAR(255),
    internship_details TEXT,
    certification_score INT DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 4. Companies
CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    job_role VARCHAR(100),
    salary_lpa DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'PENDING'
);

-- 5. Eligibility Rules
CREATE TABLE IF NOT EXISTS eligibility_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT UNIQUE NOT NULL,
    min_cgpa DECIMAL(4,2) NOT NULL,
    allowed_branches TEXT NOT NULL,
    required_skills TEXT,
    backlog_allowed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 6. Placement Drives
CREATE TABLE IF NOT EXISTS placement_drives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    admin_id INT NOT NULL,
    test_date DATE,
    interview_date DATE,
    result_date DATE,
    venue VARCHAR(255),
    status VARCHAR(20) DEFAULT 'UPCOMING',
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (admin_id) REFERENCES admins(id)
);

-- 7. Applications
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    drive_id INT NOT NULL,
    status VARCHAR(30) DEFAULT 'APPLIED',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_application (student_id, drive_id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (drive_id) REFERENCES placement_drives(id)
);

-- 8. Shortlisted Candidates
CREATE TABLE IF NOT EXISTS shortlisted_candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    drive_id INT NOT NULL,
    round VARCHAR(50),
    result VARCHAR(30) DEFAULT 'PENDING',
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (drive_id) REFERENCES placement_drives(id)
);
