import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
    { path: 'employees', component: EmployeeListComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: '', redirectTo: 'employees', pathMatch: 'full' }
];
