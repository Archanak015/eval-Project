# 🎓 UniConnect - Smart Campus Management System

> A modern, role-based Smart Campus Management platform built on the MERN stack with Tailwind CSS and Vite.

---

## 🚀 Key Features

- **Role-Based Dashboards**: Tailored workspaces for **Admin**, **Faculty**, and **Students**.
- **Attendance Management**: Mark lecture-wise attendance with composite-indexed date protection, track percentage thresholds, and export records to CSV.
- **Examinations & Grades**: Create examinations, upload marks, calculate pass percentages, and manage academic transcripts.
- **Academic Tracking & Timetables**: Dynamic timetable management, syllabus progress monitoring, and subject allotments.
- **Analytics & Audit Trail**: Real-time dashboard analytics and activity streams tracking logins and campus administrative actions.
- **Enterprise Security**: JWT authentication with expiration interceptors, security headers, role authorization guards, and standardized API error structures.

---

## 🛠️ Architecture & Tech Stack

```
eval-Project-main/
├── server/
│   ├── controllers/      # Route controllers with ApiResponse & asyncHandler
│   ├── middleware/       # Auth guard, RBAC (admin/faculty), Security
│   ├── models/           # Mongoose schemas (User, Student, Faculty, Attendance, Activity...)
│   ├── routes/           # REST endpoints
│   ├── utils/            # ApiFeatures, ApiResponse, asyncHandler
│   └── index.js          # Express app entry point
│
└── client/
    ├── src/
    │   ├── api/          # Centralized Axios client & API config
    │   ├── components/   # UI components (EmptyState, NotificationPanel...)
    │   ├── context/      # AuthContext for session management
    │   ├── pages/        # Admin & Faculty management dashboards
    │   └── utils/        # CSV export & helper utilities
```

---

## 💻 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://localhost:27017` or MongoDB Atlas URI)

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
