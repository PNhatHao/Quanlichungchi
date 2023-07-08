import { Component } from '@angular/core';

import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { User, UserType } from '../models/models.module';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  hide = true;
  responseMsg: string = '';
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.registerForm = fb.group(
      {
        firstName: fb.control('', [Validators.required]),
        lastName: fb.control('', [Validators.required]),
        email: fb.control('', [Validators.required, Validators.email]),
        password: fb.control('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(15),
        ]),
        rpassword: fb.control(''),
        userType: fb.control('user')
      },
      {
        validators: [repeatPasswordValidator],
      } as AbstractControlOptions
    );
  }

  register() {
    let user: User = {
      id: 0,
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      email: this.registerForm.get('email')?.value,
      userType: UserType.USER,
      mobile: '',
      password: this.registerForm.get('password')?.value,
      blocked: false,
      active: false,
      createdOn: '',
      rank: 0,
    };
    // console.log(user);
    this.api.createAccount(user).subscribe({
      next: (res: any) => {
        console.log(res);
        this.responseMsg = res.toString();
      },
      error: (err: any) => {
        console.log('Error: ');
        console.log(err);
      },
    });
  }

  
  getFirstNameErrors() {
    if (this.FirstName.hasError('required')) return 'Yêu cầu nhập!';
    return '';
  }
  getLastNameErrors() {
    if (this.LastName.hasError('required')) return 'Yêu cầu nhập!';
    return '';
  }
  getEmailErrors() {
    if (this.Email.hasError('required')) return 'Yêu cầu nhập Email!';
    if (this.Email.hasError('email')) return 'Yêu cầu nhập đúng Email!';
    return '';
  }
  getPasswordErrors() {
    if (this.Password.hasError('required')) return 'Yêu cầu nhập Mật khẩu!';
    if (this.Password.hasError('minlength'))
      return 'Yêu cầu nhập tối thiểu 8 chữ cái số!';
    if (this.Password.hasError('maxlength'))
      return 'Yêu cầu nhập tối đa 15 chữ cái số!';
    return '';
  }



  get FirstName(): FormControl {
    return this.registerForm.get('firstName') as FormControl;
  }
  get LastName(): FormControl {
    return this.registerForm.get('lastName') as FormControl;
  }
  get Email(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }
  get Password(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }
  get RPassword(): FormControl {
    return this.registerForm.get('rpassword') as FormControl;
  }
}

export const repeatPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const pwd = control.get('password')?.value;
  const rpwd = control.get('rpassword')?.value;
  if (pwd === rpwd) {
    control.get('rpassword')?.setErrors(null);
    return null;
  } else {
    control.get('rpassword')?.setErrors({ rpassword: true });
    return { rpassword: true };
  }
};
