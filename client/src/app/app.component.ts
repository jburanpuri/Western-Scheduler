import { Component, Injectable, OnInit } from '@angular/core';
import { AuthService } from './authentication/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@Injectable()
export class AppComponent implements OnInit {
  title = 'western-search';

  constructor(private authService:AuthService) {}

  ngOnInit() : void {
    this.authService.autoAuthUser();
  }
}
