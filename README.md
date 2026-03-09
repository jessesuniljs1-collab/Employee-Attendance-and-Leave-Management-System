# 🏢 Employee Attendance and Leave Management System

A responsive and modern Employee Management System built with Angular and TypeScript, leveraging Angular Material for a sleek, premium UI/UX design.

## 📖 About
This project is a comprehensive HR management solution designed to streamline the tracking of employee attendance and the processing of leave requests. It simulates a real-world enterprise application environment with a dedicated mock backend, reactive state management, and role-based access control (HR vs. standard user). The interface focuses on a "Tech-Blue Premium" dark theme for maximum usability and aesthetic appeal.

## ✨ Features

- **📊 Dashboard**: Visual summaries of daily attendance, total employees, and pending leaves.
- **👥 Employee Roster**: View, add, edit, delete, and search employees using real-time filters.
- **✅ Attendance Tracker**: Mark daily attendance easily with instant state updates.
- **📝 Leave Request**: Intuitive form for employees to apply for various leave types with cross-field date validation.
- **🛡️ Leave Approval**: Administrative (HR-only) module integrated via strict route guards to monitor, approve, or reject employee leave requests.

## 🛠️ Tech Stack
- **Framework**: Angular v17+
- **Language**: TypeScript
- **UI Library**: Angular Material
- **Backend**: JSON Server (Mock API)

## 🚀 Setup Guide

### 1️⃣ Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (with npm)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

### 2️⃣ Installation
Clone or extract the repository and run:
```bash
npm install
```

### 3️⃣ Running the Mock Backend
This application uses `json-server` to mock a RESTful API backend handling `employees` and `leaves`.
To start the mock database, run:
```bash
npm run mock:server
```
*Wait until the server is running on `http://localhost:3000` before proceeding.*

### 4️⃣ Running the Angular App
In a **new terminal tab/window**, start the Angular development server:
```bash
npm start
```
Navigate to `http://localhost:4200` in your web browser.

## 🏗️ Architecture & Code Structure

- **🧩 Components**: Separated by feature (`dashboard`, `employees`, `attendance`, `leave-request`, `leave-approval`).
- **⚙️ Services**: `EmployeeService` and `LeaveService` use Angular's `HttpClient` to manage REST capabilities (CRUD logic) and handle observables.
- **🚦 Routing**: `app.routes.ts` handles application routing and route guards (`auth.guard.ts`).
- **🚰 Pipes/Directives**: Contains custom logic to filter and highlight components based on models (`filter-employees.pipe.ts`, `highlight-absent.directive.ts`).
- **🛡️ Interceptors**: Utilizing `api.interceptor.ts` to manage HTTP request transformations.
