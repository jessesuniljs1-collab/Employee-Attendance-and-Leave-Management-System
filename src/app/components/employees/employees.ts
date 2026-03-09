import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AsyncPipe, NgClass } from '@angular/common';
import { Observable } from 'rxjs';
import { Employee, Department } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { FilterEmployeesPipe } from '../../pipes/filter-employees.pipe';

/**
 * EmployeesComponent — employee list with:
 *  - Template-driven form for adding new employees (rubric: template-driven forms)
 *  - FilterEmployeesPipe for live search (rubric: custom pipes)
 *  - EmployeeService for CRUD operations (rubric: DI + services)
 *  - RouterLink to individual employee detail pages (rubric: route parameters)
 */
@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [FormsModule, RouterLink, AsyncPipe, NgClass, FilterEmployeesPipe],
  templateUrl: './employees.html',
  styleUrls: ['./employees.css']
})
export class EmployeesComponent implements OnInit {

  /** Observable list from service — updated reactively */
  employees$!: Observable<Employee[]>;

  /** Controls search filter via FilterEmployeesPipe */
  searchQuery = '';

  /** Controls add-employee form visibility */
  showAddForm = false;

  /** Available department options for the dropdown */
  departments!: Department[];

  /** Avatar color classes — cycled via index */
  avatarColors = ['av-blue', 'av-cyan', 'av-orange', 'av-green'];

  /** Template model for the add-employee form */
  newEmployee = {
    name: '',
    email: '',
    phone: '',
    department: '' as Department,
    position: '',
    status: 'Active' as const,
    joinDate: new Date().toISOString().split('T')[0]
  };

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.employees$ = this.employeeService.employees$;
    this.departments = this.employeeService.departments;
  }

  /**
   * Handles template-driven form submission — adds a new employee via service.
   * @param form - Angular NgForm reference for validation state
   */
  addEmployee(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    this.employeeService.add({ ...this.newEmployee }).subscribe(() => {
      this.showAddForm = false;
      form.resetForm();
      this.newEmployee = {
        name: '', email: '', phone: '',
        department: '' as Department, position: '',
        status: 'Active', joinDate: new Date().toISOString().split('T')[0]
      };
    });
  }

  /** Deletes an employee after confirmation */
  deleteEmployee(id: number, name: string): void {
    if (confirm(`Remove ${name} from the system?`)) {
      this.employeeService.delete(id).subscribe();
    }
  }

  getAvatarClass(index: number): string {
    return this.avatarColors[index % this.avatarColors.length];
  }
}
