import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public employees: Employee[] | undefined;
  public editEmployee: Employee | undefined | null;
  public deleteEmployee: Employee | undefined | null;

  constructor(private employeeService: EmployeeService) {}
  ngOnInit() {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (response: Employee[]) => {
        this.employees = response;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      },
    });
  }

  public onAddEmployee(addForm: NgForm): void {
    document.getElementById('add-employee-form')?.click();
    this.employeeService.addEmployee(addForm.value).subscribe({
      next: (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      },
    });
  }

  public onUpdateEmployee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe({
      next: (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      },
    });
  }

  public onDeleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: (response: void) => {
        this.getEmployees();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      },
    });
  }

  public searchEmployees(key: string): void {
    const results: Employee[] = [];
    if (this.employees != undefined) {
      for (const employee of this.employees) {
        if (
          employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
          employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
          employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
          employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
        ) {
          results.push(employee);
        }
      }
    }
    this.employees = results;
    if (results.length === 0 || !key) {
      this.getEmployees();
    }
  }

  public onOpenModal(employee: Employee | null, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button'); //stworzy element o nazwie #button i przypisze do zmiennej
    button.type = 'button'; //zmienia domyslny typ inputa jako button
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal'); //ustawia atrybut data-toggle na modal - data-toggle="modal"
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if (mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container?.appendChild(button);
    button.click();
  }
}
