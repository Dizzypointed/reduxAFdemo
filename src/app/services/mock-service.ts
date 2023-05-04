import { delay, of } from 'rxjs';

export interface userListType {
  id: string;
  name: string;
}

export interface userDetailsType {
  id: string;
  name: string;
  age: string;
  favoriteNumber: string;
}

export class mockService {
  private latency = 1000;
  private users: userListType[] = [
    { id: '13', name: 'Greger' },
    { id: '15', name: 'Greta' },
  ];
  private userDetails: { [id: string]: userDetailsType } = {
    '13': { id: '13', name: 'Greger', age: '51', favoriteNumber: '6' },
    '15': { id: '15', name: 'Greta', age: '20', favoriteNumber: '5' },
  };

  getUserList = () => of(this.users).pipe(delay(this.latency));

  getUserDetails = (id: string) =>
    of(this.userDetails[id]).pipe(delay(this.latency));

  updateUserDetails = (payload: userDetailsType) =>
    of(true).pipe(delay(this.latency));
}
