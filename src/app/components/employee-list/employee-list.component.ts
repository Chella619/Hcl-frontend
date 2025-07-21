import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EmployeesService } from '../../services/employees.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CourseListComponent } from '../course-list/course-list.component';
import { FormControl, FormGroup, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Employees, Employee } from '../../model/employees.model'
import { Subscription } from 'rxjs';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-employee-list',
  imports: [MatTableModule, MatIconModule, ReactiveFormsModule, MatInputModule, CommonModule, MatButtonModule, MatPaginatorModule, MatTooltipModule ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})

export class EmployeeListComponent {

  employees!: any;
  @ViewChild('employeeEditDisplay', { static: false }) employeeEditDisplay!: TemplateRef<any>;
  employeeForm!: UntypedFormGroup;
  searchField = new UntypedFormControl('');
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  totalEmployees: number = 0;
  pageSize: number = 10;
  pageIndex: number = 1;

  subscriptionObject: Subscription = new Subscription();

  constructor(
    private employeeService: EmployeesService, 
    protected dialog: MatDialog,
  ) {}

  ngOnInit(){
    this.getEmployees();
  }

  /**
   * to get employee details
   * @param search contains search text
   */
  getEmployees(search: string = ''){
    this.subscriptionObject.add(this.employeeService.getAllEmployees(this.pageIndex, this.pageSize, search).subscribe({
      next: (data: any) =>{
        this.employees = data.employees;
        this.totalEmployees = data.total;
        this.pageIndex = data.page - 1;
      },
      error: (err) => {
        console.log(err);
      }
    }));
  }

  /**
   * to change content when value changed in paginator
   * @param event contains paginator values
   */
  onPageChange(event: { pageIndex: number; pageSize: number; }){
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getEmployees();
  }

  /**
   * To view Details
   * @param id constains Delegate Id
   */
  viewEmployee(id: string){
    this.dialog.open(CourseListComponent, {
      panelClass: 'custom-dialog',
      data: id
    })
  }

  /**
   * To edit employee
   * @param employee contains employee details 
   */
  editEmployee(employee: Employee){
    this.employeeForm = new FormGroup({
      firstName: new FormControl(employee.recordes.first_name, {validators: [Validators.required]}),
      lastName: new FormControl(employee.recordes.last_name, {validators: [Validators.required]}),
      delegateId: new FormControl(employee.recordes.delegate_id)
    })
    this.dialog.open(this.employeeEditDisplay, {
      width: '850px'
    })
  }

  /**
   * To delete employee
   * @param employee contains employee details
   */
  deleteEmployee(employee: Employee){
    this.subscriptionObject.add(this.employeeService.deleteEmployee(employee.employee_id).subscribe({
        next: (data)=>{
          console.log(data);
          this.getEmployees();
          this.dialog.closeAll();
        }
      }));
  }

  /**
   * On search text
   * @param text contains value from search field
   */
  searchKey(text: Event | any){
    this.getEmployees(text?.target?.value)
  }

  /**
   * On Form Submit
   */
  onSubmit(){
    if(this.employeeForm.valid){
      this.subscriptionObject.add(this.employeeService.updateEmployee(this.employeeForm.value.delegateId, this.employeeForm.value).subscribe({
        next: (data)=>{
          console.log(data);
          this.getEmployees();
          this.dialog.closeAll();
        }
      }));
    }
  }

  ngOnDestroy(){
    this.subscriptionObject.unsubscribe();
  }

}
