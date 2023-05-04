import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  createAction,
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
  props,
} from '@ngrx/store';
import { switchMap, map, tap } from 'rxjs';
import { mockService, userDetailsType } from '../services/mock-service';
import * as users from '../state/user-list'; // users är ett lokalt namn och behöver därför inte vara så specifikt tycker jag

// actions har generiska namn för enkelhetens skull och för att förenkla copy paste
// scopet av den store man använder ger kontext vid användning ex. userDetails.load
enum actions {
  load = '[userDetails] load',
  loadSuccess = '[userDetails] load success',
  update = '[userDetails] update',
  updateSuccess = '[userDetails] update success',
}

export const load = createAction(actions.load, props<{ payload: string }>());
export const loadSuccess = createAction(
  actions.loadSuccess,
  props<{ payload: userDetailsType }>()
);
export const update = createAction(
  actions.update,
  props<{ payload: userDetailsType }>()
);
export const updateSuccess = createAction(
  actions.updateSuccess,
  props<{ payload: userDetailsType }>()
);

// Generiskt namn för att förenkla copypaste
interface stateType {
  data: userDetailsType | undefined;
  isLoading: boolean;
  isLoaded: boolean;
}

// Generiskt namn för att förenkla copypaste
const initialState: stateType = {
  data: undefined,
  isLoading: false,
  isLoaded: false,
};

// Generiskt namn för att förenkla copypaste
export const reducer = createReducer<stateType>(
  initialState,
  on(load, (state) => ({ ...state, isLoading: true, isLoaded: false })),
  on(loadSuccess, (state, { payload }) => ({
    ...state,
    data: payload,
    isLoading: false,
    isLoaded: true,
  })),
  on(updateSuccess, (state, { payload }) => ({ ...state, data: payload }))
);

// selectors
export const featureName = 'userDetails'; // Generiskt namn för att förenkla copypaste

const featureSelector = createFeatureSelector<stateType>(featureName);

export const isLoaded = (id: string | null) =>
  createSelector(
    featureSelector,
    (state) => state.isLoaded && state.data?.id === id
  );

export const isLoading = createSelector(
  featureSelector,
  (state) => state.isLoading
);

export const data = createSelector(
  featureSelector,
  (state) => state.data || { id: '-1', name: '', age: '', favoriteNumber: '' }
);

//effects
@Injectable()
export class Effects {
  // Generiskt namn för att förenkla copypaste
  constructor(private actions$: Actions, private service: mockService) {}

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(load),
      tap(({ payload }) => console.log(payload)),
      switchMap(({ payload }) =>
        this.service
          .getUserDetails(payload)
          .pipe(map((payload) => loadSuccess({ payload })))
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(update),
      switchMap(({ payload }) =>
        this.service
          .updateUserDetails(payload)
          .pipe(
            switchMap(() => [
              updateSuccess({ payload }),
              users.update({ payload }),
            ])
          )
      )
    )
  );
}
