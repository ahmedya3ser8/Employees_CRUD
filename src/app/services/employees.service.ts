import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  constructor(private httpClient: HttpClient) { }
  getAllEmployees(): Observable<any> {
    return this.httpClient.get(`http://task.soft-zone.net/api/Employees/getAllEmployees`);
  }
  addEmployee(formData: any): Observable<any> {
    return this.httpClient.post(`http://task.soft-zone.net/api/Employees/addEmployee`, formData)
  }
  getEmployee(empId: number): Observable<any> {
    return this.httpClient.get(`http://task.soft-zone.net/api/Employees/getEmpByID/${empId}`);
  }
  editEmployee(formData: any): Observable<any> {
    return this.httpClient.post(`http://task.soft-zone.net/api/Employees/editEmployee`, formData)
  }
  deleteEmployee(empId: number): Observable<any> {
    return this.httpClient.get(`http://task.soft-zone.net/api/Employees/deleteEmpByID/${empId}`);
  }
}
