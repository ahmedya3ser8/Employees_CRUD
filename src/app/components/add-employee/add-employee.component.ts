import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeesService } from '../../services/employees.service';

@Component({
  selector: 'app-add-employee',
  imports: [ReactiveFormsModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  @Output() addSuccess = new EventEmitter();
  addEmployeeForm!: FormGroup;
  private readonly formBuilder = inject(FormBuilder);
  private readonly employeesService = inject(EmployeesService);
  ngOnInit(): void {
    this.addEmployeeForm = this.formBuilder.group({
      empName: [null, [Validators.required]],
      empEmail: [null, [Validators.required, Validators.email]],
      empAddress: [null, [Validators.required]],
      empPhone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]]
    })
  }
  submitForm() {
    if (this.addEmployeeForm.valid) {
      this.employeesService.addEmployee(this.addEmployeeForm.value).subscribe({
        next: (res) => {
          if (res === 1) {
            this.addEmployeeForm.reset();
            this.addSuccess.emit(); // to update all data after add
            this.closeModal.emit();
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
    } else {
      this.addEmployeeForm.markAllAsTouched()
    }
  }
  closeAddEmployeeModal() {
    this.closeModal.emit();
  }
}
