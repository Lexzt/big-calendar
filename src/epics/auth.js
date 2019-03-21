import * as AuthActionTypes from '../actions/auth';
import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import { map,
  mergeMap
} from 'rxjs/operators';
import getDb from '../db';



// This needs to be in db/auth file.
// If you see this message please transfer it there
export const storeUsersEpics = (action$) => action$.pipe(
  ofType(AuthActionTypes.SUCCESS_GOOGLE_AUTH),
  mergeMap(action => from(getDb()).pipe(
    map(db => {
      updateDatabase(db,action.payload.user);
    }),
  ))
);

const updateDatabase =  (db,user) => {
  db.persons.upsert(user);
  return;
};
