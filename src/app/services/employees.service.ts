import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private http: HttpClient) { }

  getAllEmployees(page: number, limit: number, search: string = ''){
    return this.http.get(`http://localhost:8000/hcl/employee?page=${page}&limit=${limit}&search=${search}`);
  }

  updateEmployee(id: string, body: any){
    return this.http.post(`http://localhost:8000/hcl/employee/${id}`, body);
  }

  deleteEmployee(id: string){
    return this.http.delete(`http://localhost:8000/hcl/employee/${id}`);
  }
}
