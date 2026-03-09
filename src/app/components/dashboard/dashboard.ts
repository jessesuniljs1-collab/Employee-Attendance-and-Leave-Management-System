import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable, combineLatest, map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { LeaveService } from '../../services/leave.service';

/**
 * DashboardComponent — the main landing page showing key HR metrics.
 * Uses EmployeeService and LeaveService (DI + Observables) to load stats.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  /** Observables from services — displayed with async pipe */
  totalEmployees$!: Observable<number>;
  pendingLeaves$!: Observable<number>;
  approvedLeaves$!: Observable<number>;
  onLeave$!: Observable<number>;

  /** Access-denied notification when redirected by AuthGuard */
  accessDenied = false;

  constructor(
    private employeeService: EmployeeService,
    private leaveService: LeaveService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Bind stats from service observables
    this.totalEmployees$ = this.employeeService.employees$.pipe(map(e => e.length));
    this.pendingLeaves$ = this.leaveService.countByStatus('Pending');
    this.approvedLeaves$ = this.leaveService.countByStatus('Approved');
    this.onLeave$ = this.leaveService.countByStatus('Approved'); // same as approved

    // Check if redirected from a guard-protected route
    this.route.queryParams.subscribe(params => {
      this.accessDenied = !!params['accessDenied'];
    });
  }
}
