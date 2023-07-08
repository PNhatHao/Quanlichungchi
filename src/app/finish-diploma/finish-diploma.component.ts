import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-finish-diploma',
  templateUrl: './finish-diploma.component.html',
  styleUrls: ['./finish-diploma.component.scss']
})
export class FinishDiplomaComponent {
  status: string = '';
  diplomaForm: FormGroup;

  constructor(private api: ApiService, private fb: FormBuilder) {
    this.diplomaForm = this.fb.group({
      diplomaId: fb.control('', [Validators.required]),
      userId: fb.control('', [Validators.required]),
    });
  }

  finishDiploma() {
    let diploma = (this.diplomaForm.get('diplomaId') as FormControl).value;
    let user = (this.diplomaForm.get('userId') as FormControl).value;
    this.api.finishDiploma(diploma, user).subscribe({
      next: (res: any) => {
        if (res === 'success') this.status = 'Hoàn thành chứng chỉ';
        else this.status = res;
      },
      error: (err: any) => console.log(err),
    });
  }
}
