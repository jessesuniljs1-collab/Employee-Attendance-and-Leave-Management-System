import { Pipe, PipeTransform } from '@angular/core';
import { Employee } from '../models/employee.model';

/**
 * FilterEmployeesPipe — custom pipe that filters the employees list
 * by name, department, position, or status.
 *
 * Usage in templates:
 *   employees | filterEmployees : searchQuery
 *
 * This pipe is impure (pure: false) so it reacts to external changes
 * in the search query input.
 */
@Pipe({
    name: 'filterEmployees',
    standalone: true,
    pure: false
})
export class FilterEmployeesPipe implements PipeTransform {

    /**
     * Filters the employee array based on a search query.
     * @param employees - The full list of employees to filter
     * @param query - The search string entered by the user
     * @returns Filtered array of employees matching the query
     */
    transform(employees: Employee[] | null, query: string): Employee[] {
        if (!employees) return [];
        if (!query || query.trim() === '') return employees;

        const q = query.toLowerCase().trim();

        return employees.filter(emp =>
            emp.name.toLowerCase().includes(q) ||
            emp.department.toLowerCase().includes(q) ||
            emp.position.toLowerCase().includes(q) ||
            emp.status.toLowerCase().includes(q)
        );
    }
}
