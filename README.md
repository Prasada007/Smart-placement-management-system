# Smart Placement Management System (SPMS)

A full-stack placement management system built to automate and streamline
the entire campus placement process — from student registration to
final shortlisting.

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Backend     | Spring MVC 6.1, Spring Security 6 |
| ORM         | Hibernate 6.6 + Spring Data JPA   |
| Database    | MySQL 8.4                         |
| Auth        | JWT (jjwt 0.12.6)                 |
| Build       | Maven                             |
| Server      | Apache Tomcat 10.1.55             |
| Java        | Java 17                           |

---

## Modules

### Student
- Register and login
- Update profile (skills, internship, certifications)
- Upload resume (PDF, max 2MB)
- View upcoming placement drives
- Apply for eligible drives
- Track application status

### Company
- Register with job role and salary details
- Define eligibility criteria (CGPA, branch, skills, backlog)
- View students who applied to their drives

### Admin / Placement Officer
- Approve or reject company registrations
- Schedule placement drives (test date, interview date, venue)
- Trigger auto-shortlisting based on eligibility rules
- View placement analytics dashboard

---

## Key Features

### Eligibility Engine
Automatically checks each student against company rules:
- CGPA >= required minimum
- Branch in allowed list
- No active backlog (if not allowed)
- All required skills present in student profile

### Auto-Shortlisting
One API call shortlists all eligible students for a drive instantly.
Returns reasons for ineligibility for rejected students.

### Analytics Dashboard
Real-time stats:
- Total students, companies, drives
- Students placed and placement percentage
- Highest package offered
- Students yet to apply

---

## Database Schema

8 tables: `students`, `student_profiles`, `companies`,
`eligibility_rules`, `placement_drives`, `applications`,
`shortlisted_candidates`, `admins`

---

## API Summary

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/students/register | Public |
| POST | /api/auth/student/login | Public |
| POST | /api/auth/admin/login | Public |
| POST | /api/auth/company/login | Public |

### Student
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/drives/upcoming | STUDENT |
| POST | /api/applications/apply | STUDENT |
| GET | /api/applications/student/{id} | STUDENT |
| POST | /api/students/{id}/resume | STUDENT |
| PUT | /api/students/{id}/profile | STUDENT |

### Admin
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/drives | ADMIN |
| PUT | /api/companies/{id}/approve | ADMIN |
| POST | /api/eligibility/shortlist/{driveId} | ADMIN |
| GET | /api/admin/dashboard | ADMIN |

### Company
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/companies/register | Public |
| GET | /api/applications/drive/{id} | COMPANY |

---

## Setup Instructions

### Prerequisites
- Java 17
- MySQL 8.x
- Apache Tomcat 10.1.x
- Maven 3.x

### Database Setup
```sql
CREATE DATABASE spms_db;
```
Then run the full SQL script from `src/main/resources/schema.sql`

### Configuration
Edit `src/main/java/com/placement/config/HibernateConfig.java`:
```java
dataSource.setUrl("jdbc:mysql://localhost:3306/spms_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true");
dataSource.setUsername("root");
dataSource.setPassword("your_password");
```

### Build and Deploy
```bash
mvn clean package -DskipTests
cp target/Placement_Management_System-1.0-SNAPSHOT.war \
   /path/to/tomcat/webapps/spms.war
```

### Test
