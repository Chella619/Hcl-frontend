import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getCounts(){
    return this.http.get('http://localhost:8000/hcl/dashboard');
  }
}
