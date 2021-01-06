import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Course } from '../models/Course.model';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';

const API_URL = `${environment.apiUrl}`

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private courses:Course[] = [];
  private coursesUpdated = new Subject<Course[]>();


  constructor(private http: HttpClient, private router:Router) { }

  getCourses() {
    this.http.get<Course[]>(`${API_URL}/courses`)
      .subscribe((courses) => {
        this.courses = courses;
        this.coursesUpdated.next([...this.courses]);
      });
  }

  getCourse(id:string) {
    return this.http.get<Course>(`${API_URL}/courses/${id}`);
  }

  searchCourses(code:string, subject:string, component:string, key:string) {
    if (code === null){
      code = ''
    }
    if (subject === null){
      subject = ''
    }
    if (component === null){
      component = ''
    }
    if (key === null){
      key = ''
    }
    this.http.get<Course[]>(`${API_URL}/courses/search/query?code=${code}&subject=${subject}&component=${component}&key=${key}`)
    .subscribe((courses) => {
      this.courses = courses;
      this.coursesUpdated.next([...this.courses]);
    });
  }

  addReview(comment:string, id:string) {
    this.http.put<Course>(`${API_URL}/courses/reviews/${id}`, { comment })
      .subscribe(course => {
        this.router.navigate([`/search`]);
      })
  }

  courseUpdateListener() {
    return this.coursesUpdated.asObservable();
  }
}
