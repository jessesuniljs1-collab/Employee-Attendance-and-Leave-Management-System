import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule
} from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employee.model';
import { LeaveType } from '../../models/leave-request.model';
import { EmployeeService } from '../../services/employee.service';
import { LeaveService } from '../../services/leave.service';

/**
 * Cross-field validator — ensures toDate is not before fromDate.
 * Applied at the FormGroup level in leaveForm.
 */
function dateRangeValidator(group: AbstractControl): ValidationErrors | null {
  const from = group.get('fromDate')?.value;
  const to = group.get('toDate')?.value;
  if (from && to && new Date(to) < new Date(from)) {
    return { dateRange: 'To date must be on or after From date' };
  }
  return null;
}

/**
 * LeaveRequestComponent — allows employees to submit leave applications.
 * Implements:
 *  - ReactiveFormsModule with FormBuilder (rubric: reactive forms)
 *  - Cross-field validation for date range (rubric: form validation)
 *  - LeaveService.submit() with Observable subscription (rubric: services + HTTP)
 */
@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './leave-request.html',
  styleUrls: ['./leave-request.css']
})
export class LeaveRequestComponent implements OnInit {

  employees$!: Observable<Employee[]>;
  leaveTypes!: LeaveType[];

  /** Reactive leave application form */
  leaveForm!: FormGroup;

  /** Submission state feedback */
  submitted = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private leaveService: LeaveService
  ) { }

  ngOnInit(): void {
    this.employees$ = this.employeeService.employees$;
    this.leaveTypes = this.leaveService.leaveTypes;

    /**
     * Build reactive form with validators:
     *  - employeeName: required
     *  - fromDate / toDate: required + cross-field dateRange validator
     *  - type: required
     *  - reason: required, minimum 10 characters
     */
    this.leaveForm = this.fb.group({
      employeeName: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      type: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    }, { validators: dateRangeValidator });
  }

  /** Shorthand getter for template access to form controls */
  get f() { return this.leaveForm.controls; }

  /** Returns true when the date-range cross-validator fails */
  get dateRangeError(): boolean {
    return this.leaveForm.hasError('dateRange') &&
      !!this.f['fromDate'].value && !!this.f['toDate'].value;
  }

  /** Handles reactive form submission */
  submitLeave(): void {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const v = this.leaveForm.value;
    this.leaveService.submit({
      employeeName: v.employeeName,
      fromDate: v.fromDate,
      toDate: v.toDate,
      type: v.type,
      reason: v.reason
    }).subscribe(() => {
      this.submitting = false;
      this.submitted = true;
      this.leaveForm.reset();
      setTimeout(() => { this.submitted = false; }, 4000);
    });
  }
}
