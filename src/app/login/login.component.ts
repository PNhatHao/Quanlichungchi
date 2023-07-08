import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hide = true;
  loginForm: FormGroup;
  responseMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.loginForm = fb.group({
      email: fb.control('', [Validators.required, Validators.email]),
      password: fb.control('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(15),
      ]),
    });
  }

  login() {
    let loginInfo = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    this.api.login(loginInfo).subscribe({
      next: (res: any) => {
        if (res.toString() === 'Invalid')
          this.responseMsg = 'Thông tin không hợp lệ!';
        else {
          this.responseMsg = '';
          this.api.saveToken(res.toString());

          // this.router.navigateByUrl("/diplomas/course");

          let isActive = this.api.getTokenUserInfo()?.active ?? false;
          if (isActive) this.router.navigateByUrl('/diplomas/course');
          else {
            this.responseMsg = 'Tài khoản không hoạt động!';
            this.api.deleteToken();
          }
        }
      },
      error: (err: any) => {
        console.log('Error: ');
        console.log(err);
      },
    });
  }

  getEmailErrors() {
    if (this.Email.hasError('required')) return 'Yêu cầu nhập Email!';
    if (this.Email.hasError('email')) return 'Email không hợp lệ.';
    return '';
  }

  getPasswordErrors() {
    if (this.Password.hasError('required')) return 'Yêu cầu nhập mật khẩu!';
    if (this.Password.hasError('minlength'))
      return 'Yêu cầu nhập tối thiểu 8 chữ cái số!';
    if (this.Password.hasError('maxlength'))
      return 'Yêu cầu nhập tối đa 15 chữ cái số!';
    return '';
  }

  get Email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }
  get Password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }
}

