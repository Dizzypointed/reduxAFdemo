import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { UserDetailsComponent } from './containers/user-details/user-details.component';
import { UserListComponent } from './containers/user-list/user-list.component';

const routes: Routes = [
  { path: 'users/:id', component: UserDetailsComponent },
  { path: 'users', component: UserListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
