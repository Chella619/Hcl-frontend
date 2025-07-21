import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CoursesService } from '../../services/courses.service';
import { MatSelectModule } from '@angular/material/select';
import { DashboardService } from '../../services/dashboard.service';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { Courses } from '../../model/courses.model'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-course-list',
  imports: [MatTableModule, MatDialogModule, CommonModule, MatIconModule, MatInputModule, MatPaginatorModule, ReactiveFormsModule, MatSelectModule, MatDatepickerModule, MatTooltipModule, MatButtonModule],
  providers: [DatePipe],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css'
})

export class CourseListComponent {

  emptyDiv = false;
  courseForm!: UntypedFormGroup;
  courses!: Courses

  totalEmployees = 0;
  pageSize = 5;
  pageIndex = 1;
  searchField = new UntypedFormControl('');
  searchText: string ='';
  statusData: any;
  @ViewChild('coursesEditDisplay', { static: false }) coursesEditDisplay!: TemplateRef<any>;
  selectedIndex!: number;
  myDialogRef!: MatDialogRef<any, any>;
  subscriptionObject: Subscription = new Subscription();
  constructor(
    @Inject(MAT_DIALOG_DATA) public id: any, 
    private courseService: CoursesService, 
    private dashboardService: DashboardService,
    protected dialog: MatDialog,
    private datePipe: DatePipe
  ){
  }

  ngOnInit(){
    this.getCourses();
    this.subscriptionObject.add(this.dashboardService.getCounts().subscribe((res: any) => {
      this.statusData = Object.keys(res.statusCounts);
      console.log(this.statusData)
    }));
  }

  /**
   * To get course details
   * @param search contains search details
   * @param filter contains filter details
   */

  getCourses(search: string = '', filter: string = ''){
    this.subscriptionObject.add(this.courseService.getCourses(this.id, this.pageIndex, this.pageSize, search, filter).subscribe({
      next: (course: any) =>{
        this.courses = course;
        console.log('this.courses', this.courses)
        this.totalEmployees = course.total;
        this.pageIndex = course.page - 1;
        if(this.courses?.records?.length == 0){
          // this.emptyDiv = true;
        }
        else{
          this.totalEmployees = this.courses?.total;
          this.pageIndex = this.courses?.page - 1;
          // this.emptyDiv = false;
        }
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
    this.getCourses();
  }

  /**
   * to get data when searched
   */
  searchKey(){
    this.subscriptionObject.add(this.searchField.valueChanges
    .pipe(
      debounceTime(300),
      switchMap((value: string) => {
        this.searchText = value;
        return this.courseService.getCourses(this.id, this.pageIndex, this.pageSize, this.searchText);
      })
    )
    .subscribe({
      next: (course: any) => {
        this.courses = course;
        this.totalEmployees = course.total;
        this.pageIndex = course.page - 1;
      },
      error: (err) => {
        console.error('Error fetching courses', err);
      }
    }));
  }

  /**
   * To get filtered content
   * @param event contains filter details
   */
  filter(event: { value: string | undefined; }){
    this.getCourses(this.searchText, event.value);
  }

  /**
   * TO edit course
   * @param course contains course details
   * @param index contains index of course
   */
  editCourse(course: { status: any; training_provider: any; valid_from: any; valid_until: any; }, index: number){
    console.log(index)
    this.selectedIndex = index;
    this.courseForm = new FormGroup({
      status: new FormControl(course.status, {validators: [Validators.required]}),
      trainingProvided: new FormControl(course.training_provider, {validators: [Validators.required]}),
      validFrom: new FormControl(course.valid_from, {validators: [Validators.required]}),
      validUntil: new FormControl(course.valid_until, {validators: [Validators.required]})
    })
    this.myDialogRef = this.dialog.open(this.coursesEditDisplay, {
      width: '500px'
    })
  }

  /**
   * To delete course 
   * @param index contains index of the course
   */
  deleteCourse(index: number){
    this.courses.records.splice(index, 1);
    console.log(this.courses.records);
    this.subscriptionObject.add(this.courseService.updateCourses(this.id, this.courses.records).subscribe({
      next: (data) => {
        console.log(data);
        this.getCourses();
      }
    }));
  }

  /**
   * On Form submit
   */
  onSubmit(){
    if(this.courseForm.valid){
      this.courses.records[this.selectedIndex].status = this.courseForm.get('status')?.value
      this.courses.records[this.selectedIndex].training_provider = this.courseForm.get('trainingProvided')?.value
      this.courses.records[this.selectedIndex].valid_from = this.datePipe.transform(this.courseForm.get('validFrom')?.value, 'yyyy-MM-dd') ?? ''
      this.courses.records[this.selectedIndex].valid_until = this.datePipe.transform(this.courseForm.get('validUntil')?.value, 'yyyy-MM-dd') ?? ''
      this.subscriptionObject.add(this.courseService.updateCourses(this.id, this.courses.records).subscribe({
        next: (data) => {
          console.log(data);
          this.getCourses();
          this.myDialogRef.close();
        }
      }));
    }
  }

  ngOnDestroy(){
    this.subscriptionObject.unsubscribe();
  }
}
