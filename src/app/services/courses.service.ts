import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http: HttpClient) { }

  getCourses(id:string, page: number, limit: number, search: string = '', filter: string = ''){
    return this.http.get(`http://localhost:8000/hcl/course/${id}?page=${page}&limit=${limit}&search=${search}&filter=${filter}`);
  }

  updateCourses(id: string, body: any){
    return this.http.post(`http://localhost:8000/hcl/course/${id}`, body);
  }
}
