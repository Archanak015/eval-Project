# UniConnect Enterprise Campus ERP — Comprehensive Production Documentation (v1.0.0)

UniConnect is an enterprise-grade University Campus Management and Academic ERP platform built on the MERN stack (MongoDB, Express, React 18 with Vite, and Node.js). Designed for high-concurrency campus environments, it implements normalized database schemas, Zero Trust role authorization, an internal event bus, federated universal search, and 50+ enterprise modules.

---

## 🏛️ System Architecture & Platform Capabilities

### 1. Core Academic Structure (Phases 1–6)
- **Hierarchical Normalization**: `Department` ➔ `Course` ➔ `Semester` ➔ `Section` ➔ `Subject` ➔ `Faculty Assignment` ➔ `Student Registration`.
- **Administrative Governance**: Complete administrative control over academic entities; students and faculty never self-assign courses.
- **Attendance & Grading Engine**: Lecture registers with bulk toggles, calculation of attendance thresholds (<75% warning), and marks entry across ESA, ISA 1, ISA 2, Labs, and Quizzes.

### 2. Multi-Disciplinary Campus Modules (Phases 7–18)
- **Library Management**: Accession numbering, ISBN tracking, catalog circulation, borrowing limits, and automated overdue penalty calculation.
- **Placement & Corporate Relations**: Company recruitment drives, eligibility filters (min CGPA, backlogs), application submission, and interview tracking.
- **Digital Document Vault**: Institutional certificates, transcripts, migration records, and verifications with secure hashes and download streams.
- **AI-Powered Academic Insights**: Rule-based and predictive models identifying low-attendance risks, academic intervention alerts, and study recommendations.
- **Multi-Tenant Campus Isolation**: Multi-institution campus data separation with custom branding, logos, and academic calendars.

### 3. Enterprise Operations & Campus Services (Phases 19–25)
- **Finance & Fee Management**: Multi-component fee structures (tuition, laboratory, caution deposit, exams), balance-due ledger, and payment receipt generation.
- **Campus Facilities & Logistics**:
  - Residential hall / hostel registers with occupancy meters, room allocations, mess fees, and warden logs.
  - University transport bus fleet tracking, designated pickup/drop stops, and annual transit pass billing.
- **Compliance & Accreditation Vault**: NAAC (Criteria 1–7), NBA, and NIRF institutional quality score tracking, SSR evidence vaults, and compliance readiness reports.
- **HR & Payroll**: Employee service history, salary slips with allowances/deductions (PF, PT, IT), leave balances, and appraisal scores.
- **Asset & Equipment Inventory**: Lab equipment, smart boards, computing assets, warranty expiry tracking, and purchase orders.

### 4. Advanced Ecosystem & Digital Campus (Phases 26–35)
- **Interactive LMS**: Course modules, video lecture streams, lecture notes, assignment uploaders, and instant-graded MCQ quizzes.
- **Research & Innovation Vault**: Tracking sponsored grants (DST-SERB, AICTE), IEEE/ACM journal publications, citation metrics (h-index), and patents.
- **Alumni Relations & Mentorship**: Global graduate directory across top technology firms, mentor matching, and endowment scholarship contributions.
- **Admission & Merit Roster**: Applicant registration, entrance exam ranking, automated composite merit calculation, and seat allotment.
- **System Administration & BI Analytics**: Cluster health metrics, Node.js process heap memory monitoring, scheduled cron queues, and departmental yield comparison.

### 5. High-Scale Enterprise Foundations (Phases 36–50)
- **Lightweight Event-Driven Architecture**: Native Node.js `ERPEventBus` decoupling business event triggers (`STUDENT_REGISTERED`, `ATTENDANCE_MARKED`, `RESULT_PUBLISHED`, `WORKFLOW_TRIGGERED`).
- **Federated Universal Search**: Global search across students, faculty, subjects, and courses with debounce and instant indexing.
- **Multi-Stage Approval Workflows**: Declarative approval chains for leave requests, seat allotments, and procurement orders with audit trails.
- **Developer API Ecosystem**: SHA-256 hashed API key provisioning, rate limiting, and event webhook subscriptions.

---

## 🔒 Security Hardening & Zero Trust Policy

1. **Helmet HTTP Headers**: Enforces strict CSP, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and referrer policies.
2. **Rate Limiting**:
   - Global API limiter: 600 requests per 15 minutes per IP.
   - Auth limiter: 30 requests per 15 minutes on sensitive authentication endpoints.
3. **NoSQL Injection Sanitization**: Strips `$` and `.` operators from request bodies, parameters, and payloads.
4. **Environment Validation**: Strict `zod` schema verification on server boot (`server/config/env.js`) for `MONGO_URI`, `JWT_SECRET`, and `CORS_ORIGIN`.
5. **Strict RBAC & Tenant Scoping**: Role enforcement middleware (`protect`, `admin`, `faculty`, `student`) preventing horizontal and vertical privilege escalation.
6. **Optimized Rollup Chunks**: Client bundle split into cached vendor, UI, and form chunks, eliminating monolithic script warnings.

---

## 🚀 Quickstart & Production Deployment

### 1. Prerequisites
- Node.js (v18.x or v20.x LTS)
- MongoDB (v6.x or v7.x)

### 2. Backend Setup
```bash
cd server
npm install
npm run seed     # Seeds base academic data
npm start        # Launches Express server on port 5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run build    # Generates optimized production assets in dist/
npm run preview  # Previews production build locally
# or npm run dev for hot-reloading development server
```

---

## 📋 Production Release Checklist (v1.0.0)

- [x] All 50 phase modules integrated without breaking legacy routes.
- [x] Optimized client bundle code-splitting via Rollup `manualChunks`.
- [x] Server health endpoint `/health` returns `200 OK` with database status `Connected`.
- [x] MongoDB collections indexed on search keys and compound relational paths.
- [x] Zero Trust JWT authentication guarding all administrative and student APIs.
- [x] Reusable responsive UI components maintaining visual design consistency.
