# UniConnect — University Academic & Campus Management System

A full-stack university management platform built with the MERN stack (MongoDB, Express, React, Node.js). 

UniConnect was designed to solve a common problem in campus administration: fragmented software tools. Instead of using separate portals for attendance, internal exams, fees, library access, and course syllabi, UniConnect brings students, faculty, and administrative staff into a single, cohesive system with role-based access control.

---

## Overview & Why I Built This

Most university campuses use disconnected legacy portals: one for exam hall tickets, another for fee receipts, a spreadsheet for attendance, and paper records for hostel allocations. 

I built UniConnect to provide:
1. **Clear Separation of Responsibilities**: Administrators configure departments, courses, and subjects; faculty manage attendance and grade assessments; students track their progress and review fee balances.
2. **Strict Data Scoping**: Faculty only view students enrolled in subjects they teach. Students can only see their own grades, attendance records, and payment receipts.
3. **Real-time Academic Visibility**: Automated calculation of attendance percentages with warnings when records dip below the 75% university eligibility threshold.

---

## Key Features

### For Students
- **Dashboard & Academics**: View enrolled subjects, semester credits, and class timetable.
- **Attendance Tracker**: Subject-wise breakdown showing attended vs. total lectures with visual percentage indicators.
- **Grades & Transcripts**: Track Continuous Internal Assessment (ISA 1 & 2) and End Semester Assessment (ESA) scores.
- **Fee Management**: Review semester tuition, lab, and exam fees, with printable receipts for completed transactions.
- **Learning Resources (LMS)**: Access module-wise lecture notes, PDFs, assignments, and practice quizzes.
- **Campus Services**: View hostel room allocations, mess fees, and bus transit routes.

### For Faculty
- **Assigned Subjects**: Overview of assigned courses and enrolled student directories.
- **Daily Attendance Register**: Mark lecture attendance with one-click bulk toggles ("Mark All Present" / "Mark All Absent").
- **Assessment Grading**: Enter marks for exams, quizzes, and practical assignments with automatic score validation.
- **Timetable & Activity Tracking**: Weekly lecture schedules and personal teaching logs.

### For Administrators
- **Academic Setup**: Create and structure Departments, Courses (B.E, B.Tech, M.Tech), Semesters, Sections, and Subjects.
- **Faculty Allocations**: Assign faculty members to specific subjects per semester.
- **Student Admissions & Enrollments**: Process applications, review entrance ranks, and allocate departmental seats.
- **Audit Logs & System Health**: Monitor active database connections, process memory usage, and background jobs.

### Public Website & Parent Portal
- **Public University Website**: Informational homepage highlighting departments, research initiatives, and admissions.
- **Parent Portal**: Simple USN-based lookup allowing parents to check their ward's attendance percentage, exam marks, and proctor contact details without needing full ERP login credentials.

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Headless UI, Heroicons, Formik & Yup
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) stored in HTTP headers / cookies, bcrypt for password hashing
- **Security & Utilities**: Helmet, express-rate-limit, express-mongo-sanitize, CORS

---

## Project Structure

```text
eval-Project-main/
├── client/                     # Frontend React (Vite) application
│   ├── src/
│   │   ├── api/                # Axios instance with auth interceptors
│   │   ├── components/         # Reusable UI (Navbar, Layout, StatCard, Modal, Breadcrumb)
│   │   ├── context/            # AuthContext for session management
│   │   ├── pages/              # Portal pages grouped by domain
│   │   │   ├── Admin/          # Course, exam, reports, and system settings
│   │   │   ├── Faculty/        # Attendance registers, grading, student directory
│   │   │   ├── Student/        # Student dashboard, transcripts, profile
│   │   │   ├── Finance/        # Fee management and transaction receipts
│   │   │   ├── Campus/         # Hostel blocks and bus fleet logistics
│   │   │   ├── LMS/            # Curriculum modules, video links, quizzes
│   │   │   ├── Public/         # Public-facing university homepage
│   │   │   ├── Parent/         # Parent self-service ward inquiry portal
│   │   │   └── Search/         # Universal campus search
│   │   ├── App.jsx             # Route definitions and layout wrappers
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js          # Rollup manual chunk configuration
│
├── server/                     # Backend Express REST API
│   ├── config/                 # Environment validation (Zod) and DB connection
│   ├── middleware/             # JWT authentication, role guards, rate limiters
│   ├── models/                 # Normalized Mongoose schemas (Department, Subject, Attendance, etc.)
│   ├── routes/                 # Express API routes
│   ├── services/               # Lightweight event bus and background task handlers
│   ├── utils/                  # Structured logger, API response helpers, async handlers
│   ├── index.js                # Server entry point
│   └── package.json
│
├── docker-compose.yml          # Multi-container local orchestration (App + MongoDB)
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js (v18.x or v20.x LTS)
- MongoDB running locally on `mongodb://localhost:27017` (or a MongoDB Atlas URI)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/uniconnect-erp.git
cd uniconnect-erp
```

### 2. Configure Environment Variables

**Server (`server/.env`)**:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/uniconnect
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

**Client (`client/.env`)**:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Install Dependencies & Seed Data

In one terminal, set up and run the backend:
```bash
cd server
npm install
npm run seed        # Seeds sample departments, courses, subjects, and test accounts
npm start
```

In a second terminal, run the frontend client:
```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Default Test Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@uniconnect.edu` | `admin123` | Full institution setup, courses, users, and audit logs |
| **Faculty Member** | `faculty@uniconnect.edu` | `faculty123` | Attendance, marks grading, and assigned student roster |
| **Student** | `student@uniconnect.edu` | `student123` | Self-service attendance, grade cards, and fee receipts |

---

## API Overview

All private endpoints require an `Authorization: Bearer <token>` header.

| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | POST | Public | Authenticates credentials and returns JWT token |
| `/api/auth/me` | GET | Authenticated | Fetches currently logged-in user profile |
| `/api/academic/departments` | GET / POST | Admin | Manage academic departments |
| `/api/academic/courses` | GET / POST | Admin | Manage degree programs and courses |
| `/api/attendance/mark` | POST | Faculty | Submit daily lecture attendance records |
| `/api/exams/marks/upload` | POST | Faculty | Submit ISA / ESA marks for a class |
| `/api/saas/fees/my-status` | GET | Student | Retrieve student fee balance and payment history |
| `/api/saas/fees/pay` | POST | Student | Process fee installment and generate receipt |
| `/api/final/search/universal` | GET | Authenticated | Federated search across students, faculty, and courses |
| `/health` | GET | Public | Uptime status and database connection health check |

---

## Performance & Optimization Notes

- **Client Bundle Splitting**: Reconfigured Vite build using Rollup `manualChunks` to split large third-party dependencies (`vendor`, `ui`, `form`) from application code. This reduced the main bundle size from 511 kB down to 296 kB (53 kB gzipped), eliminating browser parse warnings.
- **Lean Mongoose Queries**: All read-heavy operations use `.lean()` to bypass Mongoose document hydration, speeding up response times on large class lists.
- **Compound Database Indexes**: Added compound indexes on frequently queried combinations such as `{ subject: 1, date: 1 }` in Attendance and `{ course: 1, semester: 1 }` in Subjects.

---

## Known Limitations & Next Steps

- **Payment Gateway**: The fee payment module currently generates realistic receipts and ledger balances using a mock transaction reference. Integration with live Razorpay or Stripe webhooks is planned.
- **Push Notifications**: Notification events currently route through in-app toasts and database alerts; native mobile push integration (Firebase Cloud Messaging) is on the roadmap.
- **Reporting Exports**: Basic reports are available directly in the UI and printable via browser styling; server-side PDF generation using Puppeteer is being evaluated.

---

## License

This project is licensed under the MIT License — feel free to use and adapt it for learning or portfolio purposes.
