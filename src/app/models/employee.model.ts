/**
 * Employee data models — defines all TypeScript interfaces and types
 * for the Employee domain in the L&T EMS application.
 */

/** Available departments in the organization */
export type Department =
    | 'Information Technology'
    | 'Human Resources'
    | 'Finance'
    | 'Operations'
    | 'Marketing';

/** Current employment status */
export type EmployeeStatus = 'Active' | 'Inactive';

/**
 * Core Employee interface — represents a registered employee
 * in the attendance and leave management system.
 */
export interface Employee {
    id: number;
    name: string;
    email: string;
    phone: string;
    department: Department;
    position: string;
    joinDate: string; // ISO date string YYYY-MM-DD
    status: EmployeeStatus;
}
