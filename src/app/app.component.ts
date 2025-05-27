import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AddEmployeeComponent } from "./components/add-employee/add-employee.component";
import { EditEmployeeComponent } from "./components/edit-employee/edit-employee.component";
import { EmployeesService } from './services/employees.service';
import { IEmployee } from './interfaces/iemployee';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [AddEmployeeComponent, EditEmployeeComponent, NgxPaginationModule, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'employees';
  currentPage: number = 1;
  page: number = 1;
  total!: number;
  itemsPerPage: number = 10;
  isOpen: boolean = false;
  isEditOpen: boolean = false;
  empId!: number;
  employeesList: IEmployee[] = [];
  selectedEmployees: Set<number> = new Set();
  isAllSelected: boolean = false;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  destroy$: Subject<any> = new Subject();
  private readonly employeesService = inject(EmployeesService)
  private readonly spinner = inject(NgxSpinnerService)
  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.spinner.show();
    this.employeesService.getAllEmployees().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.employeesList = res;
        this.total = res.length;
        this.spinner.hide();
      },
      error: (err) => {
        console.log(err);
        this.spinner.hide();
      }
    })
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  openAddEmployeeModal() {
    this.isOpen = !this.isOpen;
  }

  handleCloseModal() {
    this.isOpen = false;
  }

  openEditEmployeeModal(id: number) {
    this.isEditOpen = !this.isEditOpen;
    this.empId = id;
  }

  handleCloseEditModal() {
    this.isEditOpen = false;
  }

  changePage(event: any) {
    this.page = event;
    this.getAllEmployees();
  }

  getCurrentPageItems(): number {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.total);
    return endIndex - startIndex;
  }

  toggleSelectAll() {
    this.isAllSelected = !this.isAllSelected;
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.total);
    for (let i = startIndex; i < endIndex; i++) {
      const employee = this.employeesList[i];
      if (this.isAllSelected) {
        this.selectedEmployees.add(employee.empId);
      } else {
        this.selectedEmployees.delete(employee.empId);
      }
    }
  }

  toggleEmployeeSelection(empId: number) {
    if (this.selectedEmployees.has(empId)) {
      this.selectedEmployees.delete(empId);
    } else {
      this.selectedEmployees.add(empId);
    }
    // Check if all items on current page are selected
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.total);
    this.isAllSelected = Array.from(this.employeesList.slice(startIndex, endIndex))
      .every(emp => this.selectedEmployees.has(emp.empId));
  }

  isEmployeeSelected(empId: number): boolean {
    return this.selectedEmployees.has(empId);
  }

  deleteEmployee(empId: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete"
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeesService.deleteEmployee(empId).subscribe({
          next: (res) => {
            console.log(res);
            Swal.fire({
              title: "Deleted!",
              text: "Your product has been deleted.",
              icon: "success"
            });
            this.getAllEmployees();
          },
          error: (err) => {
            console.log(err);
          }
        })
      }}
    )
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      // If clicking the same column, toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // If clicking a new column, set it as ascending
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.employeesList.sort((a: any, b: any) => {
      const ascending = a[column].toLowerCase();
      const descending = b[column].toLowerCase();
      if (this.sortDirection === 'asc') {
        return ascending.localeCompare(descending);
      } else {
        return descending.localeCompare(ascending);
      }
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return 'fa-sort';
    }
    return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  ngOnDestroy(): void {
    this.destroy$.next('destroy')
  }
}
