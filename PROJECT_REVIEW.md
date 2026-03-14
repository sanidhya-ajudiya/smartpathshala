# Project Review & Upgrade Plan

## 1. Project Analysis

### Folder Structure
- **Frontend**: Good structure (`components`, `pages`, `services`, `context`).
- **Backend**: Standard MVC (`controllers`, `models`, `routes`, `middleware`).
- **Database**: `schema.sql` exists, relational design is decent but needs normalization improvements.

### Weakness Report
1.  **Security**:
    -   Missing `express-validator` for input sanitization.
    -   Missing Rate Limiting in `server.js` to prevent DDoS/Brute-force.
    -   JWT verification is purely stateless; no check for banned/inactive users in `authMiddleware`.
2.  **Database**:
    -   Missing `audit_logs` table for tracking user actions.
    -   `payroll` table links only to `staff`, not `teachers`.
    -   `marks` table could benefit from a `term_id` or `academic_year`.
    -   `users` table uses `role_id` directly, which limits users to a single role (acceptable for now, but `user_roles` exists and is unused).
3.  **Architecture**:
    -   Error handling in `server.js` is basic text-based (`res.send('Something broke!')`). Needs JSON standardized response.
    -   No standardized API response utility function.
4.  **Frontend/UI**:
    -   `DataTable` component missing features: CSV Export, Sorting, Advanced Filtering.
    -   Role-Based Access Control (RBAC) is not enforced on frontend routes (e.g., `/settings` is accessible to anyone logged in).
    -   Sidebar does not dynamically hide items based on permissions.

## 2. Priority List

### P0 (Critical - Security & Core Architecture)
-   [Backend] Implement `rate-limiting` middleware.
-   [Backend] Add `validationMiddleware` using `express-validator`.
-   [Backend] Standardize Error Handling & API Responses.
-   [Database] Create `migration_v1.sql` to add `audit_logs` and fix table relationships.
-   [Frontend] Enforce RBAC on Routes in `App.js`.

### P1 (Important - Functionality & UI)
-   [Frontend] Create robust `DataTable` component (Search, Sort, Pagination, Export).
-   [Frontend] Dynamic Sidebar based on permissions.
-   [Backend] Implement Audit Logging in controllers.

### P2 (Enhancement - UI Polish)
-   [Frontend] Enhance "Modern + Classic" theme consistency (Shadows, Spacing).
-   [Frontend] Add Skeleton loaders for better UX.

---

## 3. Implementation Plan

I will now proceed with the upgrades in the following order:
1.  **Architecture Upgrade**: Backend middlewares, error handling, standardized responses.
2.  **Database Upgrade**: Apply migration script.
3.  **UI/UX Upgrade**: Create `DataTable`, enhance Sidebar.
4.  **RBAC Implementation**: Frontend & Backend logic.
5.  **Module Upgrade**: Apply changes to `Students` and others.
