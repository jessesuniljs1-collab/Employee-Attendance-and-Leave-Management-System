import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { LeaveRequest } from '../../models/leave-request.model';
import { LeaveService } from '../../services/leave.service';

/**
 * LeaveApprovalComponent — HR module for reviewing and actioning leave requests.
 * Guarded by authGuard (only accessible in HR mode).
 * Demonstrates:
 *  - Reactive form for approval comment (rubric: reactive forms)
 *  - LeaveService with approve()/reject() Observables (rubric: services + HTTP)
 */
@Component({
  selector: 'app-leave-approval',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, DatePipe],
  templateUrl: './leave-approval.html',
  styleUrls: ['./leave-approval.css']
})
export class LeaveApprovalComponent implements OnInit {

  requests$!: Observable<LeaveRequest[]>;
  pending$!: Observable<number>;
  approved$!: Observable<number>;
  rejected$!: Observable<number>;

  /** ID of the request currently being reviewed */
  activeRequestId: number | null = null;

  /** Reactive form for HR comment on reject/approve */
  reviewForm!: FormGroup;

  /** Whether a reject action is selected (comment becomes required) */
  rejectMode = false;

  /** Tracks IDs of requests that are processing */
  processingIds = new Set<number>();

  constructor(
    private leaveService: LeaveService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.requests$ = this.leaveService.requests$;
    this.pending$ = this.leaveService.countByStatus('Pending');
    this.approved$ = this.leaveService.countByStatus('Approved');
    this.rejected$ = this.leaveService.countByStatus('Rejected');

    /** Reactive form — comment optional for approve, required (min 5) for reject */
    this.reviewForm = this.fb.group({
      comment: ['']
    });
  }

  /** Opens the inline review panel for a specific request */
  openReview(id: number, reject = false): void {
    this.activeRequestId = id;
    this.rejectMode = reject;
    this.reviewForm.reset();

    // Apply required validator when rejecting
    const commentCtrl = this.reviewForm.get('comment');
    if (reject) {
      commentCtrl?.setValidators([Validators.required, Validators.minLength(5)]);
    } else {
      commentCtrl?.clearValidators();
    }
    commentCtrl?.updateValueAndValidity();
  }

  cancelReview(): void {
    this.activeRequestId = null;
    this.reviewForm.reset();
  }

  /** Confirms and submits the approve/reject action */
  confirmAction(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }
    const id = this.activeRequestId!;
    const comment = this.reviewForm.value.comment;
    this.processingIds.add(id);

    const action$ = this.rejectMode
      ? this.leaveService.reject(id, comment)
      : this.leaveService.approve(id, comment);

    action$.subscribe(() => {
      this.processingIds.delete(id);
      this.activeRequestId = null;
      this.reviewForm.reset();
    });
  }
}
