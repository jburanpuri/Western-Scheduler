import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  isUserAuthenticated = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getIsAuth();
    this.authService.getAuthStatus().subscribe((isAuth) => {
      this.isUserAuthenticated = isAuth;
    });
  }
}
