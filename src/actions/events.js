export const GET_EVENTS_BEGIN = 'GET_EVENTS_BEGIN';
export const GET_EVENTS_SUCCESS = 'GET_EVENTS_SUCCESS';
export const GET_EVENTS_FAILURE = 'GET_EVENTS_FAILURE';

export const POST_EVENT_BEGIN = 'POST_EVENT_BEGIN';
export const POST_EVENT_SUCCESS = 'POST_EVENT_SUCCESS';
export const POST_EVENT_FAILURE = 'POST_EVENT_FAILURE';

export const MOVE_EVENT_BEGIN = 'BEGIN_MOVE_EVENT';
export const MOVE_EVENT_SUCCESS = 'MOVE_EVENT_SUCCESS';
export const MOVE_EVENT_FAILURE = 'MOVE_EVENT_FAILURE';


//You good bro?
export const EDIT_EVENT_BEGIN = 'EDIT_EVENT_BEGIN';
export const EDIT_EVENT_SUCCESS = 'EDIT_EVENT_SUCCESS';
export const EDIT_EVENT_FAILURE = 'EDIT_EVENT_FAILURE';

export const QUICK_ADD_EVENT_BEGIN = 'QUICK_ADD_EVENT_BEGIN';
export const QUICK_ADD_EVENT_SUCCESS = 'QUICK_ADD_EVENT_SUCCESS';
export const QUICK_ADD_EVENT_FAILURE = 'QUICK_ADD_EVENT_FAILURE';

export const UPDATE_EVENTS_BEGIN = 'UPDATE_EVENTS_BEGIN';
export const UPDATE_EVENTS_SUCCESS = 'UPDATE_EVENTS_SUCCESS';
export const UPDATE_EVENTS_FAILURE = 'UPDATE_EVENTS_FAILURE';

export const DELETE_EVENT_BEGIN = 'DELETE_EVENT';
export const DELETE_EVENT_SUCCESS = 'DELETE_EVENT_SUCCESS';
export const DELETE_EVENT_FAILURE = 'DELETE_EVENT_FAILURE';


export const beginGetGoogleEvents = (resp) => ({
  type: GET_EVENTS_BEGIN,
  payload: resp
})

export const postEventBegin = (calEvent) => ({
  type: POST_EVENT_BEGIN,
  payload: calEvent
})

export const getEventsSuccess = (response) => ({
  type: GET_EVENTS_SUCCESS,
  payload: {
    data: response,
  }
})
