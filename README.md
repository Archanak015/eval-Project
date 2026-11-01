# UniConnect Enterprise Campus ERP – Documentation & Architecture Guide

UniConnect is an enterprise-grade University Campus Management and Academic ERP system built on the MERN stack (MongoDB, Express, React 18 with Vite, and Node.js). It provides unified operations across administrators, faculty, and students with strict backend data authorization.

---

## 🏛️ System Architecture & Portals

### 1. Administrator Portal
- **Academic Structure ERP**: Centralized management of Departments, Courses, Semesters, Sections, Curriculum Subjects, and Faculty Workload Allocations.
- **Student Enrollment & Approval**: Official registration of students to courses and semester subject registers.
- **Examination Management**: Scheduling and monitoring across all assessment formats: **ESA, ISA 1, ISA 2, Summer ESA, Assignments, Quizzes, and Labs**.
- **Audit & Governance**: Live audit stream tracking grading events, attendance sessions, and logins.

### 2. Faculty Portal
- **Assigned Subjects**: View and manage assigned curriculum subjects.
- **Lecture Attendance Register**: Daily lecture attendance marking with bulk "Mark All Present" & "Mark All Absent" actions.
- **Evaluation Marks Grading**: Grade entry with automatic percentage calculation and pass threshold validation.
- **Cohort-Restricted Student Directory**: Flexible search (Name, Enrollment No, USN, Section) restricted strictly to assigned students.
- **Teaching Workload & Timetable**: Day-by-day timetable and class schedule.

### 3. Student Self-Service Portal
- **Academic Dashboard**: Official registered curriculum subjects, credits, and syllabus details.
- **Live Attendance Meter**: Subject-by-subject attendance percentages and alerts.
- **Grade Transcript**: Published examination scores, status (Passed/Needs Improvement).
- **Class Timetable & Campus Bulletins**: Real-time schedules and announcements.

---

## 🔒 Security & Hardening Architecture

1. **Helmet HTTP Headers**: Enforces `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and strict referrer policies.
2. **Rate Limiting**:
   - Global API limiter: 600 requests per 15 minutes per IP.
   - Auth limiter: 30 requests per 15 minutes on login and register endpoints to prevent brute-force attacks.
3. **NoSQL Injection Sanitization**: Uses `express-mongo-sanitize` to strip `$` and `.` operators from client inputs.
4. **Environment Validation**: Centralized validation using `zod` (`server/config/env.js`) ensuring `MONGO_URI`, `JWT_SECRET`, and `CORS_ORIGIN` conform to production standards.
5. **Role-Based Access Control (RBAC)**: Backend middleware (`protect`, `admin`, `faculty`, `student`, `authorize(...)`, and `facultyScope`) guarantees that frontend URL tampering is blocked with `HTTP 403 Forbidden`.
6. **File System Audit Logging**: Structured JSON logging to `server/logs/access.log` and `server/logs/error.log`.

---

## 🗄️ Database Relational Hierarchy

```
Department (CSE, ISE, AIML, ECE, MECH, CIVIL)
    ↓
Degree Course (B.E, B.Tech, M.Tech, MCA, MBA)
    ↓
Semester (1 to 12)
    ↓
Section (A, B, C)
    ↓
Subject (CS201, CS202, CS203 - Credits, Max/Internal/External Marks)
    ↓
FacultyAssignment (Admin-allocated: Faculty ↔ Subject, Sem, Section)
    ↓
StudentRegistration (Official enrollment: Student ↔ Subject, Sem, Section)
    ↓
Attendance / Marks / Examination Results (Strictly scoped to registered cohorts)
```

---

## 🚀 Deployment & Installation Guide

### Prerequisites
- Node.js v18+ or v20+
- MongoDB v6+ running locally or MongoDB Atlas URI
- Git

### Quick Setup

```bash
# 1. Clone repository
git clone https://github.com/your-org/uniconnect.git
cd uniconnect

# 2. Configure Server Environment
cd server
cp .env.example .env

# Edit .env with your database URI and secrets:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/uniconnect
# JWT_SECRET=your_super_secret_jwt_key
# CORS_ORIGIN=http://localhost:5173

# 3. Install Server Dependencies & Start
npm install
npm start

# 4. Install Client Dependencies & Start
cd ../client
npm install
npm run dev
```

### Docker Deployment

```bash
docker-compose up --build -d
```

---

## 📡 REST API Reference

| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | POST | Public | Authenticate user & return JWT Bearer token |
| `/api/auth/register` | POST | Public | Student/Faculty account creation |
| `/api/auth/me` | GET | Auth | Retrieve authenticated profile & departmental allocations |
| `/api/erp/departments` | GET/POST | Auth/Admin | List or create academic departments |
| `/api/erp/courses` | GET/POST | Auth/Admin | List or create degree programs |
| `/api/erp/subjects` | GET/POST | Auth/Faculty | List curriculum subjects or add new subject |
| `/api/erp/faculty-assignments`| GET/POST | Faculty/Admin| Manage institutional faculty subject assignments |
| `/api/erp/student-registrations`| GET/POST | Scoped/Admin | Register students into semester curriculum subjects |
| `/api/erp/marks` | GET/POST | Scoped/Faculty| Record and inspect evaluation marks |
| `/api/attendance/students/:id` | GET | Faculty | Load eligible students registered for a subject |
| `/api/attendance/mark` | POST | Faculty | Submit lecture session attendance |
| `/api/student/dashboard` | GET | Student | Load student's own registered subjects, attendance, and grades |
| `/api/analytics/dashboard` | GET | Auth | Aggregated dashboard KPI counters and audit logs |
| `/api/analytics/search` | GET | Auth | Scoped multi-attribute search across students and courses |
