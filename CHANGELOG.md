# Changelog

All notable changes to the **UniConnect** project are documented in this file.

## [1.2.0] - 2026-10-31

### Added
- Centralized `asyncHandler` and `ApiResponse` utilities for consistent API contracts.
- Server-side `ApiFeatures` query helper for pagination, filtering, and regex searching.
- Dedicated `Activity` audit logging model and tracking for logins and registrations.
- Aggregated Analytics API (`/api/analytics/dashboard`) for student/faculty totals, attendance rates, and department enrollment distributions.
- Client-side centralized `axiosClient` with automatic 401 token refresh/logout handling.
- Reusable `exportToCsv` data exporter for attendance and student registries.
- Reusable UI `EmptyState` component for lists and tables.
- Health check route at `/health`.
- `.env.example` templates for both server and client.

### Security
- Enhanced JWT authentication middleware with `TokenExpiredError` detection and user existence checks.
- Implemented standard security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`).
