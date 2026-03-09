/**
 * Attendance data models — defines TypeScript interfaces and types
 * for daily attendance tracking records.
 */

/** Possible attendance status values for a given day */
export type AttendanceStatus = 'Present' | 'Absent' | 'Half-Day' | 'Leave' | '';

/**
 * AttendanceRecord interface — represents attendance data
 * for a single employee on a specific date.
 */
export interface AttendanceRecord {
    id: number;
    employeeId: number;
    employeeName: string;
    date: string;           // ISO date string YYYY-MM-DD
    status: AttendanceStatus;
    checkIn?: string;       // optional HH:MM time string
    checkOut?: string;      // optional HH:MM time string
}
