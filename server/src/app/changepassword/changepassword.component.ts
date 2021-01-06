import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  form: FormGroup;
  isLoading:boolean;
  private authStatusSub: Subscription;
 
  constructor(public authService:AuthService) { 
    this.form = new FormGroup({
      'currentPassword': new FormControl('', {validators: [Validators.required]}),
      'newPassword': new FormControl('', {validators: [Validators.required, Validators.minLength(6)]}),
      'confirmPassword': new FormControl('', {validators: [Validators.required, Validators.minLength(6)]}),
    });
  }


  changePassword(){
    const currentPassword = this.form.value.currentPassword
    const newPassword = this.form.value.newPassword
    const confirmPassword = this.form.value.confirmPassword

    this.isLoading = true;
    this.authService.changePassword(currentPassword, newPassword,confirmPassword);
  }


  ngOnInit(): void {

    this.authStatusSub = this.authService.getAuthStatus()
      .subscribe(status => {
        this.isLoading = status
      })
  }

  ngOnDestroy(): void{
    this.authStatusSub.unsubscribe();
  }

  
}
