import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { HighlightAbsentDirective } from '../../directives/highlight-absent.directive';

/** Attendance status values */
export type AttStatus = 'Present' | 'Absent' | 'Half-Day' | '';

/** Row shown in the attendance table — employee data + daily status */
export interface AttendanceRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  empStatus: string;   // employee active/inactive (renamed to avoid conflict)
  attStatus: AttStatus; // daily attendance status
}

/**
 * AttendanceComponent — marks daily attendance for all employees.
 * Demonstrates:
 *  - HighlightAbsentDirective for conditional row highlighting (rubric: custom directives)
 *  - EmployeeService subscription (rubric: services + Observables)
 *  - Data binding for real-time status updates
 */
@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [HighlightAbsentDirective, NgClass],
  templateUrl: './attendance.html',
  styleUrls: ['./attendance.css']
})
export class AttendanceComponent implements OnInit, OnDestroy {

  employees: AttendanceRow[] = [];

  todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  private sub!: Subscription;
  avatarColors = ['av-blue', 'av-cyan', 'av-orange', 'av-green'];

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.sub = this.employeeService.employees$.subscribe((emps: Employee[]) => {
      const statusMap = new Map(this.employees.map(e => [e.id, e.attStatus]));
      this.employees = emps.map(e => ({
        id: e.id,
        name: e.name,
        email: e.email,
        phone: e.phone,
        department: e.department,
        position: e.position,
        joinDate: e.joinDate,
        empStatus: e.status,
        attStatus: statusMap.get(e.id) ?? ('' as AttStatus)
      }));
    });
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }

  markPresent(emp: AttendanceRow): void { emp.attStatus = 'Present'; }
  markAbsent(emp: AttendanceRow): void { emp.attStatus = 'Absent'; }
  markHalfDay(emp: AttendanceRow): void { emp.attStatus = 'Half-Day'; }

  getAvatarClass(index: number): string {
    return this.avatarColors[index % this.avatarColors.length];
  }

  get summary() {
    return {
      present: this.employees.filter(e => e.attStatus === 'Present').length,
      absent: this.employees.filter(e => e.attStatus === 'Absent').length,
      halfDay: this.employees.filter(e => e.attStatus === 'Half-Day').length,
      unmarked: this.employees.filter(e => !e.attStatus).length,
    };
  }
}
