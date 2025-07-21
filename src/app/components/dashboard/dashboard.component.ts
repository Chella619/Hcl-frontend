import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../../services/dashboard.service';
import {MatExpansionModule} from '@angular/material/expansion';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, CommonModule, BaseChartDirective, MatExpansionModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  courseData: any = {};
  statusData: any = {};
  providerData: any = {};

  subscriptionObject: Subscription = new Subscription();

  constructor(private http: HttpClient,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.subscriptionObject.add(this.dashboardService.getCounts().subscribe((res: any) => {
      this.courseData = { 
        labels: this.getKeys(res.courseCounts), 
        datasets: [{ 
          label: 'Course Count',
          data: this.getKeys(res.courseCounts).map(k => res.courseCounts[k]) ,
          // backgroundColor: 'rgba(63, 81, 181, 0.6)', // Optional styling
          // borderColor: '#3f51b5',
          // borderWidth: 1
        }] 
      }
      this.statusData = { 
        labels: this.getKeys(res.statusCounts), 
        datasets: [{ 
          label: 'User Count',
          data: this.getKeys(res.statusCounts).map(k => res.statusCounts[k]) 
        }] 
      }
      this.providerData = { 
        labels: this.getKeys(res.providerCounts), 
        datasets: [{ 
          label: 'Provides Count',
          data: this.getKeys(res.providerCounts).map(k => res.providerCounts[k]) 
        }] 
      }
    }));
  }

  /**
   * to get only key values of the object
   * @param obj contains dashboard object
   * @returns keys in array
   */
  getKeys(obj: any) {
    return Object.keys(obj);
  }

  ngOnDestroy(){
    this.subscriptionObject.unsubscribe();
  }
}
