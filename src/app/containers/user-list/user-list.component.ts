import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, tap } from 'rxjs';

import * as users from '../../state/user-list'; // users är ett lokalt namn och behöver därför inte vara så specifikt tycker jag

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  isLoaded$ = this.store.select(users.isLoaded);

  isLoading$ = this.store.select(users.isLoading);

  waitingForData$ = combineLatest([this.isLoaded$, this.isLoading$]).pipe(
    tap(
      ([loaded, loading]) =>
        !loaded && !loading && this.store.dispatch(users.load())
    ),
    map(([loaded, loading]) => !loaded || loading)
  );

  data$ = this.store.select(users.data);

  constructor(private store: Store) {}
}
