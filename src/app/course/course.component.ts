import { Component, OnInit } from '@angular/core';
import { Diploma, CategoryDiplomas } from '../models/models.module';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  availableDiplomas: Diploma[] = [];
  diplomasToDisplay: CategoryDiplomas[] = [];
  displayedColumns: string[] = [
    'id',
    'title',
    'position',
    // 'point',
    'available',
    'order',
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAllDiplomas().subscribe({
      next: (res: Diploma[]) => {
        this.availableDiplomas = [];
        console.log(res);
        for (var diploma of res) this.availableDiplomas.push(diploma);
        this.updateList();
      },
      error: (err: any) => console.log(err),
    });
  }

  updateList() {
    this.diplomasToDisplay = [];
    for (let diploma of this.availableDiplomas) {
      let exist = false;
      for (let categoryDiplomas of this.diplomasToDisplay) {
        if (
          diploma.category === categoryDiplomas.category &&
          diploma.subCategory === categoryDiplomas.subCategory
        )
          exist = true;
      }

      if (exist) {
        for (let categoryDiplomas of this.diplomasToDisplay) {
          if (
            diploma.category === categoryDiplomas.category &&
            diploma.subCategory === categoryDiplomas.subCategory
          )
            categoryDiplomas.diplomas.push(diploma);
        }
      } else {
        this.diplomasToDisplay.push({
          category: diploma.category,
          subCategory: diploma.subCategory,
          diplomas: [diploma],
        });
      }
    }
  }

  getDiplomaCount() {
    return this.diplomasToDisplay.reduce((pv, cv) => cv.diplomas.length + pv, 0);
  }

  search(value: string) {
    value = value.toLowerCase();
    this.updateList();
    if (value.length > 0) {
      this.diplomasToDisplay = this.diplomasToDisplay.filter((categoryDiplomas) => {
        categoryDiplomas.diplomas = categoryDiplomas.diplomas.filter(
          (diploma) =>
            diploma.title.toLowerCase().includes(value) ||
            diploma.position.toLowerCase().includes(value)
        );
        return categoryDiplomas.diplomas.length > 0;
      });
    }
  }

  orderDiploma(diploma: Diploma) {
    let userid = this.api.getTokenUserInfo()?.id ?? 0;
    this.api.orderDiploma(userid, diploma.id).subscribe({
      next: (res: any) => {
        if (res === 'success') {
          diploma.available = false;
        }
      },
      error: (err: any) => console.log(err),
    });
  }

  isBlocked() {
    let blocked = this.api.getTokenUserInfo()?.blocked ?? true;
    return blocked;
  }
}
