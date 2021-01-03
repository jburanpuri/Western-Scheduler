import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Schedule } from '../models/Schedule.model';
import { Subject } from 'rxjs'
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

const API_URL = `${environment.apiUrl}` 

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {
  private userSchedules: Schedule[] = [];
  private currentSchedule: Schedule;
  private publicSchedules: Schedule[] = [];
  private currentScheduleUpdated = new Subject<Schedule>();
  private userSchedulesUpdated = new Subject<Schedule[]>();
  private publicSchedulesUpdated = new Subject<Schedule[]>();


  constructor(private http: HttpClient, private router:Router) { }

  getPublicSchedules() {
    this.http.get<Schedule[]>(`${API_URL}/schedule/public`)
      .subscribe((schedules) => {
        this.publicSchedules = schedules;
        this.publicSchedulesUpdated.next([...this.publicSchedules]);
      });
  }

  getSchedules() {
    this.http.get<Schedule[]>(`${API_URL}/schedule/user`)
      .subscribe((schedules) => {
        this.userSchedules = schedules;
        this.userSchedulesUpdated.next([...this.userSchedules]);
      });
  }

  getUserSchedule(id:string|null) {
    return this.http.get<Schedule>(`${API_URL}/schedule/${id}`);
  }

  getCurrentSchedule(id:string) {
    this.http.get<Schedule>(`${API_URL}/schedule/${id}`)
      .subscribe(schedule => {
        this.currentSchedule = schedule;
        this.currentScheduleUpdated.next({...this.currentSchedule});
      })
  }

  addCourse(id:string, courseId:string) {
    const body = {
      courseId
    }
    this.http.put<Schedule>(`${API_URL}/schedule/courses/add/${id}`, body)
      .subscribe(schedule => {
        this.currentSchedule = schedule;
        this.currentScheduleUpdated.next({...this.currentSchedule});
      })
  }

  deleteCourse(id:string, courseId:string) {
    this.http.delete<Schedule>(`${API_URL}/schedule/courses/delete/${id}/${courseId}`)
      .subscribe(schedule => {
        this.currentSchedule = schedule;
        this.currentScheduleUpdated.next({...this.currentSchedule});
      })
  }

  createSchedule(name:string, desc:string, isPublic:boolean) {
    const body = {
      name,
      desc,
      isPublic
    }
    this.http.post<Schedule>(`${API_URL}/schedule`, body)
      .subscribe((schedule) => {
        this.userSchedules.push(schedule);
        this.userSchedulesUpdated.next([...this.userSchedules]);
        this.router.navigate(['/schedules']);
      });
  }

  updateSchedule(id:string|null, name:string, desc:string, isPublic:boolean) {
    const body = {
      name,
      desc,
      isPublic
    }
    this.http.put<Schedule>(`${API_URL}/schedule/update/${id}`, body)
      .subscribe(schedule => {
        const newSchedules = this.userSchedules.filter(sche => sche._id !== schedule._id);
        newSchedules.unshift(schedule);
        this.userSchedules = newSchedules;
        this.userSchedulesUpdated.next([...this.userSchedules]);
        this.router.navigate(['/schedules']);
      })
  }

  deleteSchedule(id: string) {
    this.http.delete(`${API_URL}/schedule/delete/${id}`)
      .subscribe(() => {
        const updatedSchedules = this.userSchedules.filter(schedule => schedule._id !== id);
        this.userSchedules = updatedSchedules;
        this.userSchedulesUpdated.next([...this.userSchedules]);
      })
  }

  userScheduleUpdateListener() {
    return this.userSchedulesUpdated.asObservable()
  }

  currentScheduleUpdateListener() {
    return this.currentScheduleUpdated.asObservable()
  }

  publicScheduleUpdateListener() {
    return this.publicSchedulesUpdated.asObservable()
  }
}
