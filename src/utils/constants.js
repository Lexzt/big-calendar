import moment from 'moment';
import md5 from 'md5';

export const OUTLOOK = 'OUTLOOK';
export const GOOGLE = 'GOOGLE';

export const dropDownTime = (currentTime) => {
  const timeOptions = [];
  let hour = 0;
  let initialTime = 0;
  let minute;
  let value;
  if(currentTime !== '') {
    initialTime = parseInt(currentTime.substring(0, 2), 10) * 2;
    if(currentTime.substring(2) === "30") {
      initialTime = initialTime + 1;
    }
  }
  //currentTime algo needs to be tweaked for same time shown in start and end.
  for(let i = initialTime; i < 48; i++) {
    (i % 2 == 0) ? minute = '00' : minute = '30';
    hour = convertHour(Math.floor(i / 2));
    value = hour + minute;
    timeOptions.push({value: value, label: value})
  }
  return timeOptions;
}

const convertHour = (i) => {
  if(i < 10) {
    return '0' + i.toString() + ':';
  }
  return i.toString() + ':';
}

export const momentAdd = (day, time) => {
  debugger;
  const editedDay = moment(day)
                        .set('H', parseInt(time.substring(0, 2)))
                        .set('m' , parseInt(time.substring(3)));
  const formattedDay = moment(editedDay).format();
  return formattedDay;
}

export const filterIntoSchema = (dbEvent, type) => {
  switch(type) {
    case GOOGLE:
      ['kind',
        'etag',
        'extendedProperties',
        'conferenceData',
        'reminders',
        'attachments',
        'hangoutLink'].forEach(e => delete dbEvent[e]);
      dbEvent.originalId = dbEvent.id;
      dbEvent.id = md5(dbEvent.id);
      dbEvent.creator = dbEvent.creator.email;
      dbEvent.providerType = GOOGLE;

      return dbEvent;
    case OUTLOOK:
      ['@odata.etag'].forEach(e => delete dbEvent[e]);
      var schemaCastedDbObject = {};

      schemaCastedDbObject.id = md5(dbEvent.id);
      schemaCastedDbObject.originalId = dbEvent.id;
      schemaCastedDbObject.htmlLink = dbEvent.webLink;
      schemaCastedDbObject.status = dbEvent.isCancelled ? 'cancelled' : 'confirmed';
      schemaCastedDbObject.created = dbEvent.createdDateTime;
      schemaCastedDbObject.updated = dbEvent.lastModifiedDateTime;
      schemaCastedDbObject.summary = dbEvent.subject;
      schemaCastedDbObject.description = dbEvent.bodyPreview; // Might need to use .body instead, but it returns html so idk how to deal w/ it now
      schemaCastedDbObject.location = JSON.stringify(dbEvent.location.coordinates); // We need to convert coordinates coz idk how else to represent it
      schemaCastedDbObject.creator = dbEvent.organizer.emailAddress.address;
      schemaCastedDbObject.organizer = { email: dbEvent.organizer.emailAddress.address, displayName: dbEvent.organizer.emailAddress.name };
      schemaCastedDbObject.start = { dateTime: dbEvent.start.dateTime, timezone: dbEvent.originalStartTimeZone };
      schemaCastedDbObject.end = { dateTime: dbEvent.end.dateTime, timezone: dbEvent.originalEndTimeZone };
      // schemaCastedDbObject.endTimeUnspecified = dbEvent.responseStatus;
      // schemaCastedDbObject.recurrence = dbEvent.recurrence;      // Need to write converted from microsoft graph lib to standard array
      schemaCastedDbObject.recurringEventId = (dbEvent.seriesMasterId === null || dbEvent.seriesMasterId === undefined) ? "" : dbEvent.seriesMasterId;
      schemaCastedDbObject.originalStartTime = { dateTime: dbEvent.originalStartTime, timezone: dbEvent.originalStartTimeZone };
      // schemaCastedDbObject.transparency = dbEvent.responseStatus;
      schemaCastedDbObject.visibility = "default";
      schemaCastedDbObject.iCalUID = dbEvent.iCalUId;
      // schemaCastedDbObject.sequence = dbEvent.responseStatus;
      schemaCastedDbObject.attendees = dbEvent.attendees;

      // schemaCastedDbObject.anyoneCanAddSelf = dbEvent.responseStatus;
      // schemaCastedDbObject.guestsCanInviteOthers = dbEvent.responseStatus;
      // schemaCastedDbObject.guestsCanModify = dbEvent.responseStatus;
      // schemaCastedDbObject.guestsCanSeeOtherGuests = dbEvent.responseStatus;
      // schemaCastedDbObject.privateCopy = dbEvent.responseStatus;
      // schemaCastedDbObject.locked = dbEvent.responseStatus;
      schemaCastedDbObject.allDay = dbEvent.isAllDay;

      // schemaCastedDbObject.calenderId = dbEvent.responseStatus;
      // schemaCastedDbObject.source = dbEvent.responseStatus;
      schemaCastedDbObject.providerType = OUTLOOK;

      return schemaCastedDbObject;
    default:
      console.log("Provider " + type + " not available");
  }
}
