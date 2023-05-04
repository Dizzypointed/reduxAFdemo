import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, switchMap, tap } from 'rxjs';
import { userDetailsType } from 'src/app/services/mock-service';
import * as user from '../../state/user-details';
import * as users from '../../state/user-list';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent {
  id$ = this.route.paramMap.pipe(map((p) => p.get('id')));

  isLoaded$ = this.id$.pipe(
    switchMap((id) => this.store.select(user.isLoaded(id)))
  );

  isLoading$ = this.store.select(user.isLoading);

  waitingForData$ = combineLatest([
    this.isLoaded$,
    this.isLoading$,
    this.id$,
  ]).pipe(
    tap(
      ([loaded, loading, payload]) =>
        !loaded &&
        !loading &&
        payload !== null &&
        this.store.dispatch(user.load({ payload }))
    ),
    map(([loaded, loading]) => !loaded || loading)
  );

  data$ = this.store.select(user.data);

  constructor(private route: ActivatedRoute, private store: Store) {}

  saveUser($event: { data: userDetailsType; updateName: boolean }) {
    this.store.dispatch(user.update({ payload: $event.data }));

    // if ($event.updateName) {
    //   this.store.dispatch(users.update({ payload: $event.data }));
    // }
  }
}
