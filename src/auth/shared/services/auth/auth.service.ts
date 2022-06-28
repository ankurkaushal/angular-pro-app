import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { tap } from 'rxjs';
import { Store } from 'store';

@Injectable()
export class AuthService {
  constructor(private af: AngularFireAuth, private store: Store) {}

  auth$ = this.af.authState.pipe(
    tap((next) => {
      if (!next) {
        this.store.set('user', null);

        return;
      }
      const user: User = {
        email: next.email,
        uid: next.uid,
        authenticated: true,
      };
      this.store.set('user', user);
    })
  );

  get user() {
    return this.af.currentUser;
  }

  get authState() {
    return this.af.authState;
  }

  createUser(email: string, password: string) {
    return this.af.createUserWithEmailAndPassword(email, password);
  }

  loginUser(email: string, password: string) {
    return this.af.signInWithEmailAndPassword(email, password);
  }

  logoutUser() {
    return this.af.signOut();
  }
}

export interface User {
  email: string | null;
  uid: string;
  authenticated: boolean;
}
