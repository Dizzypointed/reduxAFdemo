import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import {
  createAction,
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
  props,
} from '@ngrx/store';
import { switchMap, map, tap } from 'rxjs';
import {
  mockService,
  userDetailsType,
  userListType,
} from '../services/mock-service';

// actions har generiska namn för enkelhetens skull
// scopet av den store man använder ger kontext vid användning ex. userList.load
enum actions {
  load = '[userList] load',
  loadSuccess = '[userList] load success',
  update = '[userList] update',
}

export const load = createAction(actions.load);
export const loadSuccess = createAction(
  actions.loadSuccess,
  props<{ payload: userListType[] }>()
);
export const update = createAction(
  actions.update,
  props<{ payload: userDetailsType }>()
);

// Generiskt namn för att förenkla copypaste
interface stateType {
  data: userListType[];
  isLoading: boolean;
  isLoaded: boolean;
}

// Generiskt namn för att förenkla copypaste
const initialState: stateType = {
  data: [],
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
  on(update, (state, { payload }) => ({
    ...state,
    data: state.data.map((d) =>
      d.id === payload.id ? { ...d, name: payload.name } : d
    ),
  }))
);

// selectors
export const featureName = 'userList'; // Generiskt namn för att förenkla copypaste

const featureSelector = createFeatureSelector<stateType>(featureName);

export const isLoaded = createSelector(
  featureSelector,
  (state) => state.isLoaded
);

export const isLoading = createSelector(
  featureSelector,
  (state) => state.isLoading
);

export const data = createSelector(featureSelector, (state) => state.data);

//effects
@Injectable()
export class Effects {
  // Generiskt namn för att förenkla copypaste
  constructor(private actions$: Actions, private service: mockService) {}

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(load),
      switchMap(() =>
        this.service
          .getUserList()
          .pipe(map((payload) => loadSuccess({ payload })))
      )
    )
  );
}
