import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { PageFooterComponent } from './page-footer/page-footer.component';
import { UsersListComponent } from './users-list/users-list.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { CourseComponent } from './course/course.component';
import { DiplomaCategoriesComponent } from './diploma-categories/diploma-categories.component';

import { LoginComponent } from './login/login.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { ManageDiplomasComponent } from './manage-diplomas/manage-diplomas.component';
import { OrderComponent } from './order/order.component';
import { OrdersComponent } from './orders/orders.component';
import { FinishDiplomaComponent } from './finish-diploma/finish-diploma.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
@NgModule({
  declarations: [
    AppComponent,
    PageHeaderComponent,
    PageFooterComponent,
    UsersListComponent,
    ProfileComponent,
    RegisterComponent,
    CourseComponent,
    DiplomaCategoriesComponent,

    LoginComponent,
    ManageCategoriesComponent,
    ManageDiplomasComponent,
    OrderComponent,
    OrdersComponent,
    FinishDiplomaComponent,
    SideNavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
      tokenGetter: () => {
        return localStorage.getItem('access_token');
      },
      allowedDomains: ['localhost:7096'],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
