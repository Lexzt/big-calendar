import { map, mergeMap, switchMap, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import {
  SUCCESS_GOOGLE_AUTH,
  SUCCESS_OUTLOOK_AUTH
} from '../../actions/auth';
import {
  successStoreAuth
} from '../../actions/db/auth';
import {
  retrieveStoreEvents
} from '../../actions/db/events';
import getDb from '../../db';
import * as AuthActionTypes from '../../actions/auth';
import * as DbActionTypes from '../../actions/db/events';
import * as Providers from '../../utils/constants';

export const storeGoogleAuthEpic = action$ => action$.pipe(
  ofType(AuthActionTypes.SUCCESS_GOOGLE_AUTH),
  mergeMap((action) => from(storeUser(action.payload)).pipe(
    mergeMap(resp => of(successStoreAuth(), retrieveStoreEvents(Providers.GOOGLE))),
    catchError(error => {
      of(console.log(error));
    })
  )
 )
)

export const storeOutLookAuthEpic = action$ => action$.pipe(
  ofType(AuthActionTypes.SUCCESS_OUTLOOK_AUTH),
  mergeMap((action) => from(storeUser(action.payload)).pipe(
    mergeMap(resp => of(successStoreAuth(), retrieveStoreEvents(Providers.OUTLOOK))),
    catchError(error => {
      of(console.log(error));
    })
  )
 )
)

const storeUser = async (user) => {
  const db = await getDb();
  let userDb = '';
  try {
    userDb = await db.persons.upsert(user);
  }
  catch(e) {
    return e;
  }

  return userDb;
}
