# SmartPathshala - School Management System

An industry-standard School Management System built with React.js (Frontend), Express.js (Backend), and MySQL (Database).

## Project Structure

- **frontend/**: React CRA application with Bootstrap 5.
- **backend/**: Express REST API with JWT authentication.
- **database/**: SQL schema and seeding scripts.

## Prerequisites

- **Node.js** (v14+)
- **MySQL Server** (Running locally or remotely)

## Setup Instructions

### 1. Database Setup

1.  Make sure your MySQL server is running.
2.  Login to MySQL and create the database (or let the schema file do it):
    ```sql
    CREATE DATABASE smartpathshala_db;
    ```
3.  Import the schema:
    - You can use a GUI like Workbench or phpMyAdmin to run `database/schema.sql`.
    - OR use command line:
      ```bash
      mysql -u root -p < database/schema.sql
      ```

### 2. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    - Edit `.env` file to match your database credentials (username, password).
4.  Seed the Database (Create generic Roles and Super Admin):
    ```bash
    node scripts/seed.js
    ```
    - Default Super Admin credentials:
      - Username: `superadmin`
      - Password: `admin123`
5.  Start the backend server:
    ```bash
    npm start
    ```
    - Server will run on `http://localhost:5000`

### 3. Frontend Setup

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend application:
    ```bash
    npm start
    ```
    - App will run on `http://localhost:3000`

## Features

- **Authentication**: JWT-based login/logout.
- **RBAC**: Role-based access control with granular permissions.
- **Dashboard**: Overview of school statistics.
- **Responsive UI**: Works on Mobile, Tablet, and Desktop.

## Tech Stack

- **Frontend**: React, Bootstrap 5, FontAwesome, React Router Dom.
- **Backend**: Node.js, Express.js, MySQL.
- **Security**: bcryptjs for passwords, generic role-based middleware.

## Default Credentials

- **Super Admin**: `superadmin` / `admin123`
