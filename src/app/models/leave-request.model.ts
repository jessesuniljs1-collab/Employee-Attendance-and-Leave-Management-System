/**
 * Leave Request data models — defines TypeScript interfaces and types
 * for the leave application and approval workflow.
 */

/** Types of leave available to employees */
export type LeaveType =
    | 'Sick Leave'
    | 'Casual Leave'
    | 'Earned Leave'
    | 'Maternity/Paternity Leave';

/** Approval status of a submitted leave request */
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

/**
 * LeaveRequest interface — represents a leave application
 * submitted by an employee and reviewed by HR.
 */
export interface LeaveRequest {
    id: number;
    employeeId: number;
    employeeName: string;
    fromDate: string;       // ISO date string YYYY-MM-DD
    toDate: string;         // ISO date string YYYY-MM-DD
    type: LeaveType;
    reason: string;
    status: LeaveStatus;
    comment?: string;       // HR review comment (optional)
    submittedOn: string;    // ISO date string YYYY-MM-DD
}
