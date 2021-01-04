import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSub: Subscription;
  private adminListenerSub: Subscription;
  isAuth: boolean = false;
  isAdmin:boolean = false;
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.isAuth = this.authService.getIsAuth();
    this.isAdmin = this.authService.getIsAdmin();
    this.authListenerSub = this.authService.getAuthStatus()
      .subscribe(isAuthenticated => {
        this.isAuth = isAuthenticated;
      });
    this.adminListenerSub = this.authService.getAdminStatus()
      .subscribe(isAdmin => {
        console.log("isAdmin =" + isAdmin)
        this.isAdmin = isAdmin;
      })
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
  }

  onLogout() {
    this.authService.logoutUser();
  }

}
