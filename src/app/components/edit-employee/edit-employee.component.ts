import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeesService } from '../../services/employees.service';

@Component({
  selector: 'app-edit-employee',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.css'
})
export class EditEmployeeComponent implements OnInit {
  @Output() closeEditModal = new EventEmitter();
  @Output() editSuccess = new EventEmitter();
  @Input() empId!: number;
  editEmployeeForm!: FormGroup;
  private readonly formBuilder = inject(FormBuilder);
  private readonly employeesService = inject(EmployeesService);
  ngOnInit(): void {
    this.editEmployeeForm = this.formBuilder.group({
      empId: [null],
      empName: [null, [Validators.required]],
      empEmail: [null, [Validators.required, Validators.email]],
      empAddress: [null, [Validators.required]],
      empPhone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]]
    })
    this.getEmployee();
  }
  submitForm() {
    if (this.editEmployeeForm.valid) {
      this.employeesService.editEmployee(this.editEmployeeForm.value).subscribe({
        next: (res) => {
          if (res === 1) {
            this.editEmployeeForm.reset();
            this.editSuccess.emit(); // to update all data after edit
            this.closeEditModal.emit();
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
    } else {
      this.editEmployeeForm.markAllAsTouched();
    }
  }
  getEmployee() {
    this.employeesService.getEmployee(this.empId).subscribe({
      next: (res) => {
        this.fillForm(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  fillForm(formData: any) {
    this.editEmployeeForm.setValue({
      empId: formData.empId,
      empName: formData.empName,
      empEmail: formData.empEmail,
      empAddress: formData.empAddress,
      empPhone: formData.empPhone
    })
  }
  closeEditEmployeeModal() {
    this.closeEditModal.emit();
  }
}
