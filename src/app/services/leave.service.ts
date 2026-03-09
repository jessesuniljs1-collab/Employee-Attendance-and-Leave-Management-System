import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { LeaveRequest, LeaveStatus, LeaveType } from '../models/leave-request.model';

/**
 * LeaveService — manages all leave request operations.
 * Uses HttpClient to interact with the JSON Server REST API.
 * Shared across Leave Request and Leave Approval components.
 */
@Injectable({ providedIn: 'root' })
export class LeaveService {

    private http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:3000/leaves';

    /** BehaviorSubject for reactive real-time updates */
    private requestsSubject = new BehaviorSubject<LeaveRequest[]>([]);

    /** Public Observable stream for components to subscribe */
    requests$ = this.requestsSubject.asObservable();

    /** All available leave types — used in form dropdowns */
    readonly leaveTypes: LeaveType[] = [
        'Sick Leave',
        'Casual Leave',
        'Earned Leave',
        'Maternity/Paternity Leave'
    ];

    constructor() {
        this.loadInitialData();
    }

    private loadInitialData() {
        this.http.get<LeaveRequest[]>(this.apiUrl).subscribe({
            next: (reqs) => this.requestsSubject.next(reqs),
            error: (err) => console.error('Failed to load initial leaves', err)
        });
    }

    // ── READ ──────────────────────────────────────────────────────

    /** Get all leave requests — uses HTTP GET /leaves */
    getAll(): Observable<LeaveRequest[]> {
        return this.http.get<LeaveRequest[]>(this.apiUrl).pipe(
            tap(reqs => this.requestsSubject.next(reqs))
        );
    }

    /** Get only pending requests — useful for HR approval dashboard */
    getPending(): Observable<LeaveRequest[]> {
        return this.http.get<LeaveRequest[]>(`${this.apiUrl}?status=Pending`);
    }

    /** Count requests by status — for dashboard stats */
    countByStatus(status: LeaveStatus): Observable<number> {
        return this.http.get<LeaveRequest[]>(`${this.apiUrl}?status=${status}`).pipe(
            map(reqs => reqs.length)
        );
    }

    // ── CREATE ────────────────────────────────────────────────────

    /** Submit a new leave request — uses HTTP POST /leaves */
    submit(req: Partial<LeaveRequest>): Observable<LeaveRequest> {
        const newReq = {
            employeeId: req.employeeId ?? 0,
            employeeName: req.employeeName ?? '',
            fromDate: req.fromDate ?? '',
            toDate: req.toDate ?? '',
            type: req.type ?? 'Casual Leave',
            reason: req.reason ?? '',
            status: 'Pending' as LeaveStatus,
            submittedOn: new Date().toISOString().split('T')[0],
            comment: null
        };

        return this.http.post<LeaveRequest>(this.apiUrl, newReq).pipe(
            tap(savedReq => {
                const currentReqs = this.requestsSubject.value;
                this.requestsSubject.next([...currentReqs, savedReq]);
            })
        );
    }

    // ── UPDATE ────────────────────────────────────────────────────

    /** Approve a leave request — uses HTTP PUT /leaves/:id */
    approve(id: number, comment?: string): Observable<LeaveRequest> {
        const reqToUpdate = this.requestsSubject.value.find(r => r.id === id);
        if (!reqToUpdate) throw new Error('Request not found');

        const updatedReq = { ...reqToUpdate, status: 'Approved' as LeaveStatus, comment: comment || null };
        return this.http.put<LeaveRequest>(`${this.apiUrl}/${id}`, updatedReq).pipe(
            tap(res => {
                const refreshed = this.requestsSubject.value.map(r => r.id === id ? res : r);
                this.requestsSubject.next(refreshed);
            })
        );
    }

    /** Reject a leave request — uses HTTP PUT /leaves/:id */
    reject(id: number, comment: string): Observable<LeaveRequest> {
        const reqToUpdate = this.requestsSubject.value.find(r => r.id === id);
        if (!reqToUpdate) throw new Error('Request not found');

        const updatedReq = { ...reqToUpdate, status: 'Rejected' as LeaveStatus, comment };
        return this.http.put<LeaveRequest>(`${this.apiUrl}/${id}`, updatedReq).pipe(
            tap(res => {
                const refreshed = this.requestsSubject.value.map(r => r.id === id ? res : r);
                this.requestsSubject.next(refreshed);
            })
        );
    }
}
