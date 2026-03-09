import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Employee, Department } from '../models/employee.model';

/**
 * EmployeeService — manages all employee data operations.
 * Uses HttpClient to interact with the JSON Server REST API.
 * Injectable at root level for global data sharing across modules.
 */
@Injectable({ providedIn: 'root' })
export class EmployeeService {

    private http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:3000/employees';

    /** BehaviorSubject holds current employee list — allows reactive updates */
    private employeesSubject = new BehaviorSubject<Employee[]>([]);

    /** Public Observable stream — components subscribe for auto-updates */
    employees$ = this.employeesSubject.asObservable();

    /** All available departments — used for dropdowns and filtering */
    readonly departments: Department[] = [
        'Information Technology',
        'Human Resources',
        'Finance',
        'Operations',
        'Marketing'
    ];

    constructor() {
        this.loadInitialData();
    }

    private loadInitialData() {
        this.http.get<Employee[]>(this.apiUrl).subscribe({
            next: (employees) => this.employeesSubject.next(employees),
            error: (err) => console.error('Failed to load initial employees', err)
        });
    }

    // ── READ ──────────────────────────────────────────────────────

    /** Retrieves all employees — uses HTTP GET /employees */
    getAll(): Observable<Employee[]> {
        return this.http.get<Employee[]>(this.apiUrl).pipe(
            tap(employees => this.employeesSubject.next(employees))
        );
    }

    /** Retrieves a single employee by ID — uses HTTP GET /employees/:id */
    getById(id: number): Observable<Employee> {
        return this.http.get<Employee>(`${this.apiUrl}/${id}`);
    }

    // ── CREATE ────────────────────────────────────────────────────

    /** Adds a new employee — uses HTTP POST /employees */
    add(emp: Omit<Employee, 'id'>): Observable<Employee> {
        return this.http.post<Employee>(this.apiUrl, emp).pipe(
            tap(newEmp => {
                const updatedList = [...this.employeesSubject.value, newEmp];
                this.employeesSubject.next(updatedList);
            })
        );
    }

    // ── UPDATE ────────────────────────────────────────────────────

    /** Updates an existing employee record — uses HTTP PUT /employees/:id */
    update(updated: Employee): Observable<Employee> {
        return this.http.put<Employee>(`${this.apiUrl}/${updated.id}`, updated).pipe(
            tap(res => {
                const refreshedList = this.employeesSubject.value.map(e => e.id === res.id ? res : e);
                this.employeesSubject.next(refreshedList);
            })
        );
    }

    // ── DELETE ────────────────────────────────────────────────────

    /** Removes an employee — uses HTTP DELETE /employees/:id */
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                const filteredList = this.employeesSubject.value.filter(e => e.id !== id);
                this.employeesSubject.next(filteredList);
            })
        );
    }
}
