import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseViewerComponent } from './layout/course-viewer/course-viewer.component';
import { ScheduleMakerComponent } from './schedules/schedule-maker/schedule-maker.component';
import { ScheduleViewerComponent } from './layout/schedule-viewer/schedule-viewer.component';
import { PublicSchedulesComponent } from './layout/public-schedules/public-schedules.component'
import { LoginPageComponent } from './authentication/login/login.component';
import { RegisterPageComponent } from './authentication/register/register.component';
import { SingleCourseComponent } from './layout/single-course/single-course.component';
import { ScheduleBuilderComponent } from './layout/schedule-builder/schedule-builder.component';
import { AdminDashboardComponent } from './layout/admin-dashboard/admin-dashboard.component';
import { DocEditorComponent } from './docs/doc-editor/doc-editor.component';
import { DocViewerComponent } from './docs/doc-viewer/doc-viewer.component';
import { HomeComponent } from './home/home.component'
import { AuthGuard } from './authentication/auth.guard';
import { AdminGuard } from './authentication/admin.guard';
import { ChangepasswordComponent } from './changepassword/changepassword.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: CourseViewerComponent },
  { path: 'create', component: ScheduleMakerComponent, canActivate: [AuthGuard] },
  { path: 'edit/:scheduleId', component: ScheduleMakerComponent, canActivate: [AuthGuard] },
  { path: 'course/:courseId', component: SingleCourseComponent, canActivate: [AuthGuard] },
  { path: 'builder/:scheduleId', component: ScheduleBuilderComponent, canActivate: [AuthGuard] },
  { path: 'schedules', component: ScheduleViewerComponent, canActivate: [AuthGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'docs/:docId', component: DocEditorComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'public', component: PublicSchedulesComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'docs/view/:docTitle', component: DocViewerComponent },
  { path: 'changePassword', component: ChangepasswordComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AdminGuard]
})
export class AppRoutingModule { }
