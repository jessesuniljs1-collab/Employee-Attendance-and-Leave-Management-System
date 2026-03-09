import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

/**
 * EmployeeDetailComponent — displays a full profile for a single employee.
 * Uses ActivatedRoute to read the :id route parameter and loads data via EmployeeService.
 */
@Component({
    selector: 'app-employee-detail',
    standalone: true,
    imports: [AsyncPipe, DatePipe, NgClass],
    templateUrl: './employee-detail.html',
    styleUrls: ['./employee-detail.css']
})
export class EmployeeDetailComponent implements OnInit {

    employee$!: Observable<Employee | undefined>;
    avatarColors = ['av-blue', 'av-cyan', 'av-orange', 'av-green'];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private employeeService: EmployeeService
    ) { }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.employee$ = this.employeeService.getById(id);
    }

    goBack(): void {
        this.router.navigate(['/employees']);
    }

    getAvatarClass(id: number): string {
        return this.avatarColors[(id - 1) % this.avatarColors.length];
    }
}
