import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-manage-diplomas',
  templateUrl: './manage-diplomas.component.html',
  styleUrls: ['./manage-diplomas.component.scss']
})
export class ManageDiplomasComponent {
  addDiplomaForm: FormGroup;
  deleteDiplomaForm: FormControl;

  addMsg: string = '';
  delMsg: string = '';

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.addDiplomaForm = fb.group({
      title: fb.control('', [Validators.required]),
      position: fb.control('', [Validators.required]),
      category: fb.control('', [Validators.required]),
      subcategory: fb.control('', [Validators.required]),
      // point: fb.control('', [Validators.required]),
    });

    this.deleteDiplomaForm = fb.control('', [Validators.required]);
  }

  insertDiploma() {
    let diploma = {
      id: 0,
      title: this.Title.value,
      category: {
        category: this.Category.value,
        subCategory: this.Subcategory.value,
      },
      // point: this.Point.value,
      available: true,
      position: this.Position.value,
    };
    this.api.insertDiploma(diploma).subscribe({
      next: (res: any) => {
        this.addMsg = 'Đã thêm chứng chỉ';
        setInterval(() => (this.addMsg = ''), 5000);
        this.Title.setValue('');
        this.Position.setValue('');
        this.Category.setValue('');
        this.Subcategory.setValue('');
        // this.Point.setValue('');
      },
      error: (err: any) => console.log(err),
    });
  }

  deleteDiploma() {
    let id: number = parseInt(this.deleteDiplomaForm.value);

    this.api.deleteDiploma(id).subscribe({
      next: (res: any) => {
        if (res === 'success') {
          this.delMsg = 'Xóa chứng chỉ';
        } else {
          this.delMsg = 'Chứng chỉ không tồn tại';
        }
        setInterval(() => (this.delMsg = ''), 5000);
      },
      error: (err: any) => console.log(err),
    });
  }

  get Title(): FormControl {
    return this.addDiplomaForm.get('title') as FormControl;
  }
  get Position(): FormControl {
    return this.addDiplomaForm.get('position') as FormControl;
  }
  get Category(): FormControl {
    return this.addDiplomaForm.get('category') as FormControl;
  }
  get Subcategory(): FormControl {
    return this.addDiplomaForm.get('subcategory') as FormControl;
  }
  // get Point(): FormControl {
  //   return this.addDiplomaForm.get('point') as FormControl;
  // }
}
