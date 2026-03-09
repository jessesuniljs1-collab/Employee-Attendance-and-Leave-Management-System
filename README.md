# Employee Attendance and Leave Management System

A responsive Employee Management System built with Angular and TypeScript, leveraging Angular Material for a modern UI/UX design.

## Features

- **Dashboard**: Visual summaries of attendance and pending leaves.
- **Employee Roster**: View, add, delete, and search employees by numerous filters.
- **Attendance Tracker**: Mark daily attendance easily.
- **Leave Request**: Form for employees to apply for various leave types with cross-field date validation.
- **Leave Approval**: Administrative (HR) module integrated via route guards to monitor, approve, or reject employee leave requests.

## Tech Stack
- Angular v17+
- TypeScript
- Angular Material
- JSON Server (Mock API)

## Setup Guide

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (with npm)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

### 2. Installation
Clone or extract the repository and run:
```bash
npm install
```

### 3. Running the Mock Backend
This application uses `json-server` to mock a RESTful API backend handling `employees` and `leaves`.
To start the mock database, run:
```bash
npm run mock:server
```
*Wait until the server is running on `http://localhost:3000` before proceeding.*

### 4. Running the Angular App
In a **new terminal tab/window**, start the Angular development server:
```bash
npm start
```
Navigate to `http://localhost:4200` in your web browser.

## Architecture & Code Structure

- **Components**: Separated by feature (`dashboard`, `employees`, `attendance`, `leave-request`, `leave-approval`).
- **Services**: `EmployeeService` and `LeaveService` use Angular's `HttpClient` to manage REST capabilities (CRUD logic) and handle observables.
- **Routing**: `app.routes.ts` handles application routing and route guards (`auth.guard.ts`).
- **Pipes/Directives**: Contains custom logic to filter and highlight components based on models (`filter-employees.pipe.ts`, `highlight-absent.directive.ts`).
- **Interceptors**: Utilizing `api.interceptor.ts` to manage HTTP request transformations.
