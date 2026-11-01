# UniConnect Enterprise ERP — Version 2.0.0 Commercial Release Candidate

## Executive Summary
UniConnect Enterprise ERP Version 2.0.0 represents a complete transition from a traditional academic portal into a commercial-grade University Enterprise Resource Planning (ERP) platform. Built upon the MERN stack with native event-driven hooks, zero-trust role-based access control (RBAC), multi-campus tenant isolation, and automated workflow orchestrations, it is engineered for high-concurrency campus deployments.

---

## 🏛️ Comprehensive Architecture & Module Roster

### 1. Unified Identity & Security Model
- **Zero Trust JWT Enforcement**: Cryptographically secure token verification with token expiration, sliding refresh windows, and server-side secret validation.
- **Strict Role-Based Access Control (RBAC)**: Enforced via `protect`, `admin`, `faculty`, and `student` middleware. Unauthorized horizontal or vertical elevation returns standard `401 Unauthorized` or `403 Forbidden`.
- **Comprehensive Threat Protection**:
  - Helmet security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, strict referrers).
  - Parameter & body NoSQL injection sanitization preventing selector attacks (`$gt`, `$where`).
  - Rate-limiting gates on public authentication vectors (30 reqs/15m) and general API routes (600 reqs/15m).
  - Strict CORS origin reflection and environment variable validation using `zod`.

### 2. Core Academic & Curriculum Hierarchy
- **Normalized Data Architecture**:
  `Department` ➔ `Course` ➔ `Semester` ➔ `Section` ➔ `Subject` ➔ `Faculty Assignment` ➔ `Student Registration`
- **Lecture Registers**: Real-time attendance ledger with batch attendance marking, low-attendance alerts (<75%), and historical session audits.
- **Examinations & Evaluation Engine**: Flexible assessment grading supporting ESA, ISA 1, ISA 2, Quizzes, Assignments, and Practical Labs with automated threshold scoring.

### 3. Campus Operations & SaaS Facilities
- **Interactive LMS (Phase 26)**: Video lectures, courseware documents, assignment submission gateways, and self-assessment MCQ quizzes with instant client-side grading.
- **Research & Innovation Vault (Phase 27)**: Institutional repository tracking funded research grants, IEEE/ACM publications, patent filings, and citation indices.
- **Global Alumni Network (Phase 28)**: Directory of alumni across Tier-1 tech organizations, 1-on-1 mentorship bookings, and endowment scholarship tracking.
- **Admissions Management (Phase 29)**: Online application submission, ranking, composite merit calculation, and provisional seat allotment.
- **Campus Fleet & Housing (Phases 21 & 22)**: Hostel residential hall occupancy monitoring, mess fees, and bus fleet routing with GPS tags.
- **Finance & Fee Ledger (Phase 19)**: Fee structure breakdown (tuition, exam, lab, caution deposit), balance-due meters, and official receipt generation.
- **Accreditation & Compliance Vault (Phase 24)**: NAAC Criteria (1–7), NBA, and NIRF qualitative scores (projection 3.82 / 4.00 Grade A++), SSR audit trails, and exportable reports.

### 4. Advanced Enterprise Foundations (Phases 36–50)
- **Event-Driven Architecture**: Lightweight native Node.js `ERPEventBus` for asynchronous decoupled communication (`STUDENT_REGISTERED`, `ATTENDANCE_MARKED`, `RESULT_PUBLISHED`, `WORKFLOW_TRIGGERED`).
- **Federated Universal Search**: Multi-index search engine indexing Students, Faculty, Subjects, and Courses.
- **Workflow & Approval Engine**: Multi-stage approval routing for leave requests, seat allotments, and procurement orders with comprehensive audit trails.
- **Developer API Ecosystem**: SHA-256 hashed API token issuance and webhook dispatching for external integrations.
- **System Diagnostics & Telemetry**: Live Node.js process heap memory analytics, server uptime, database status, and departmental academic yield metrics.

---

## 🚀 DevOps & CI/CD Pipeline
- **Docker Compose**: Containerized multi-container setup running MongoDB 6 and Node.js backend.
- **GitHub Actions (`.github/workflows/ci.yml`)**: Automated CI pipeline running MongoDB service containers, backend health checks, and frontend production Vite builds on Node 20.

---

## 📊 Verification & Benchmarks
- **Production Client Build**: 0 errors, optimized chunking via Rollup `manualChunks` (main chunk 296 kB, gzipped 53 kB).
- **Backend API Health**: `http://localhost:5000/health` responds with `200 OK` (MongoDB Connected).
- **Role Guard Security**: Unauthenticated requests to protected endpoints return `401 Unauthorized`.
