import * as AuthActionTypes from '../actions/auth';
import * as ProviderTypes from '../utils/constants';

const initialState = {
  providers: {
    [ProviderTypes.GOOGLE]: [],
    [ProviderTypes.OUTLOOK]: [],
  },
  expiredProviders: {
    [ProviderTypes.GOOGLE]: [],
    [ProviderTypes.OUTLOOK]: [],
  },
  isAuth: false,
  currentUser: null       // currentUser is here bcuz of google auth. Not sure how to append it over yet.
};

export default function authReducer(state = initialState, action) {
  switch(action.type) {
    // ----------------------------------------------- GOOGLE ----------------------------------------------- //
    case AuthActionTypes.BEGIN_GOOGLE_AUTH:
      return Object.assign({}, state, {isAuth: true, currentUser: null});
    case AuthActionTypes.SUCCESS_GOOGLE_AUTH:
      return Object.assign({}, state, {isAuth: false, providers: {
        [ProviderTypes.GOOGLE]: (state.providers[ProviderTypes.GOOGLE].filter(e => e.personId === action.payload.user.personId).length > 0)
          ? state.providers[ProviderTypes.GOOGLE].map(e => e.personId === action.payload.user.personId
            ? action.payload.user
            : e
          )
          : state.providers[ProviderTypes.GOOGLE].concat(action.payload.user) ,
        [ProviderTypes.OUTLOOK]: state.providers[ProviderTypes.OUTLOOK]
        // [ProviderTypes.GOOGLE]: state.providers[ProviderTypes.GOOGLE].concat(action.payload.user),
      },
      expiredProviders: {
        [ProviderTypes.GOOGLE]: state.expiredProviders[ProviderTypes.GOOGLE].filter(user => user.originalId !== action.payload.user.originalId),
        [ProviderTypes.OUTLOOK]: state.expiredProviders[ProviderTypes.OUTLOOK]
      }});
    case AuthActionTypes.FAIL_GOOGLE_AUTH:
      return Object.assign({}, state, {isAuth: false, currentUser: null});
    case AuthActionTypes.EXPIRED_GOOGLE_AUTH:
      return Object.assign({}, state, {isAuth: false, expiredProviders: {
        [ProviderTypes.GOOGLE]:
          (state.expiredProviders[ProviderTypes.GOOGLE].filter(e => e.personId === action.payload.user.personId).length > 0) ?
            state.expiredProviders[ProviderTypes.GOOGLE] : state.expiredProviders[ProviderTypes.GOOGLE].concat(action.payload.user),
        [ProviderTypes.OUTLOOK]: state.expiredProviders[ProviderTypes.OUTLOOK]
      }});
      // ----------------------------------------------- GOOGLE ----------------------------------------------- //

      // ----------------------------------------------- OUTLOOK ----------------------------------------------- //
    case AuthActionTypes.BEGIN_OUTLOOK_AUTH:
      return Object.assign({}, state, {isAuth: true, currentUser: null});
    case AuthActionTypes.SUCCESS_OUTLOOK_AUTH:
      return Object.assign({}, state, {isAuth: false,
        providers: {
          [ProviderTypes.GOOGLE]: state.providers[ProviderTypes.GOOGLE],
          [ProviderTypes.OUTLOOK]:
            (state.providers[ProviderTypes.OUTLOOK].filter(e => e.personId === action.payload.user.personId).length > 0)
              ? state.providers[ProviderTypes.OUTLOOK].map(e => e.personId === action.payload.user.personId
                ? action.payload.user
                : e
              )
              : state.providers[ProviderTypes.OUTLOOK].concat(action.payload.user)
          // [ProviderTypes.OUTLOOK]: state.providers[ProviderTypes.OUTLOOK].concat(action.payload.user)
        },
        expiredProviders: {
          [ProviderTypes.GOOGLE]: state.expiredProviders[ProviderTypes.GOOGLE],
          [ProviderTypes.OUTLOOK]: state.expiredProviders[ProviderTypes.OUTLOOK].filter(user => user.originalId !== action.payload.user.originalId)
        }});
    case AuthActionTypes.FAIL_OUTLOOK_AUTH:
      return Object.assign({}, state, {isAuth: false, currentUser: null});
    case AuthActionTypes.EXPIRED_OUTLOOK_AUTH:
      return Object.assign({}, state, {isAuth: false, expiredProviders: {
        [ProviderTypes.GOOGLE]: state.expiredProviders[ProviderTypes.GOOGLE],
        [ProviderTypes.OUTLOOK]:
          (state.expiredProviders[ProviderTypes.OUTLOOK].filter(e => e.personId === action.payload.user.personId).length > 0) ?
            state.expiredProviders[ProviderTypes.OUTLOOK] : state.expiredProviders[ProviderTypes.OUTLOOK].concat(action.payload.user),
      }});
      // ----------------------------------------------- OUTLOOK ----------------------------------------------- //
    default:
      return state;
  }
}
