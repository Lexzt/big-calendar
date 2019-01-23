import { createLogger } from 'redux-logger';
export const loggerMiddleware = createLogger();


const CALENDAR_ID = 'shamsheer619@gmail.com';
const MicrosoftGraph = require("@microsoft/microsoft-graph-client");

function googleCalendarEvents() {
  return window.gapi.client.request({
        'path': `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`,
      }).then(resp => {
      let events = resp.result.items;
      return events;
    }, (reason) => {
      return reason;
    });
}

function outlookCalendarEvents() {
  return MicrosoftGraph.Client.init({
    authProvider: (done) => {
      done(null, window.localStorage.getItem('at'))
    }
  }).api('/me/events')
    .top(10)
    .select('subject,start,end,createdDatetime')
    .orderby('createdDatetime DESC')
    .get((err, res) => {
      if (err) {
        return err;
      } else {
        return res.value;
      }
    });
}


export const apiMiddleware = store => next => action => {
  if(action.type === 'GET_GOOGLE_EVENTS') {
    const value = googleCalendarEvents();
    next({
      type: action.type + '_SUCCESS',
      payload: {
        data: value
      }
    })
  }
  if(action.type === 'GET_OUTLOOK_EVENTS') {
    const value = outlookCalendarEvents();
    next({
      type: action.type + '_SUCCESS',
      payload: {
        data: value
      }
    })
  }

  return next(action);
}