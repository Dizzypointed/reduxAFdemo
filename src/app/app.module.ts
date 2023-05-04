import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UserListComponent } from './containers/user-list/user-list.component';
import { mockService } from './services/mock-service';
import * as userlist from './state/user-list';
import * as userdetails from './state/user-details';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { UserDetailsComponent } from './containers/user-details/user-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditFormComponent } from './containers/user-details/components/edit-form/edit-form.component';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserDetailsComponent,
    EditFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    StoreModule.forRoot({
      [userlist.featureName]: userlist.reducer,
      [userdetails.featureName]: userdetails.reducer,
    }),
    EffectsModule.forRoot([userlist.Effects, userdetails.Effects]),
    environment.production ? [] : StoreDevtoolsModule.instrument(),
  ],
  providers: [mockService],
  bootstrap: [AppComponent],
})
export class AppModule {}
