import { Component, OnInit } from '@angular/core';
import { SideNavItem, User, UserType } from '../models/models.module';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  user!: User | null;

  sideNavContent: SideNavItem[] = [
    {
      title: 'Danh sách chứng chỉ',
      link: 'diplomas/course',
      permission: [0, 1]
    },
    {
      title: 'Danh sách đăng kí',
      link: 'users/order',
      permission: [0, 1]
    },
    {
      title: 'Mở chứng chỉ',
      link: 'diplomas/finish',
      permission: [0]
    },
    {
      title: 'Quản lí chứng chỉ',
      link: 'diplomas/maintenance',
      permission: [0]
    },
    {
      title: 'Quản lí ngành nghề',
      link: 'diplomas/categories',
      permission: [0]
    },

    {
      title: 'Quản lí người dùng',
      link: 'users/list',
      permission: [0]
    },
    {
      title: 'Quản lí đăng kí',
      link: 'users/all-orders',
      permission: [0]
    },

  ];

  constructor(private api: ApiService) {

  }

  ngOnInit() {
    this.user = this.api.getTokenUserInfo();
  }

  checkPermission(option: SideNavItem): boolean  {
    if(this.user && this.user.userType >= 0) {
      return option.permission.includes(this.user?.userType)
    }
    return false;
  }
}
