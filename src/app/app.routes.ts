import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { EmployeesComponent } from './components/employees/employees';
import { AttendanceComponent } from './components/attendance/attendance';
import { LeaveRequestComponent } from './components/leave-request/leave-request';
import { LeaveApprovalComponent } from './components/leave-approval/leave-approval';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail';
import { authGuard } from './guards/auth.guard';

/**
 * Application routes — defines all navigation paths.
 *
 * Route overview:
 *   /                  → Dashboard (overview + stats)
 *   /employees         → Employee list with search and add form
 *   /employees/:id     → Individual employee detail view (route parameter)
 *   /attendance        → Daily attendance tracking
 *   /leave-request     → Leave application form (reactive form + validation)
 *   /leave-approval    → HR leave approval module (guarded: HR only)
 *   **                 → Redirects to dashboard
 */
export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'employees/:id', component: EmployeeDetailComponent },  // route parameter
  { path: 'attendance', component: AttendanceComponent },
  { path: 'leave-request', component: LeaveRequestComponent },
  {
    path: 'leave-approval',
    component: LeaveApprovalComponent,
    canActivate: [authGuard]   // restricted to HR users
  },
  { path: '**', redirectTo: '' }  // wildcard fallback
];
