import moment from 'moment';
import md5 from 'md5';

export const OUTLOOK = 'OUTLOOK';
export const GOOGLE = 'GOOGLE';
export const EXCHANGE = 'EXCHANGE'

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
  var schemaCastedDbObject = {};
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
    case EXCHANGE:
      schemaCastedDbObject.id = md5(dbEvent.Id.UniqueId);
      schemaCastedDbObject.originalId = dbEvent.Id.UniqueId;
      schemaCastedDbObject.htmlLink = dbEvent.WebClientReadFormQueryString;
      schemaCastedDbObject.status = dbEvent.IsCancelled === undefined ? 'confirmed' : 'cancelled';
      schemaCastedDbObject.created = dbEvent.DateTimeCreated.getMomentDate().format("YYYY-MM-DDTHH:mm:ssZ");
      schemaCastedDbObject.updated = dbEvent.LastModifiedTime.getMomentDate().format("YYYY-MM-DDTHH:mm:ssZ");
      schemaCastedDbObject.summary = dbEvent.Subject;

      // schemaCastedDbObject.description = dbEvent.Body === undefined ? "" : dbEvent.Body; // IDK WHY BODY HAS ISSUE. WHAT.

      schemaCastedDbObject.location = dbEvent.Location === null ? "" : dbEvent.location;
      // schemaCastedDbObject.creator = dbEvent.Organizer.address;

      schemaCastedDbObject.organizer = { email: dbEvent.Organizer.address, displayName: dbEvent.Organizer.name };
      // schemaCastedDbObject.organizer = { email: dbEvent.Organizer.name, displayName: dbEvent.Organizer.name }; // This makes no sense, address does not exist in the organizer object, LOL
      
      schemaCastedDbObject.start = { dateTime: dbEvent.Start.getMomentDate().format("YYYY-MM-DDTHH:mm:ssZ") };
      schemaCastedDbObject.end = { dateTime: dbEvent.End.getMomentDate().format("YYYY-MM-DDTHH:mm:ssZ") };
      // schemaCastedDbObject.endTimeUnspecified = dbEvent.responseStatus;
      // schemaCastedDbObject.recurrence = dbEvent.Recurrence();      // Need to write converted from microsoft EWS to some format.
      // schemaCastedDbObject.recurringEventId = dbEvent.ICalRecurrenceId;
      // schemaCastedDbObject.originalStartTime = { dateTime: dbEvent.originalStartTime, timezone: dbEvent.originalStartTimeZone };
      // schemaCastedDbObject.transparency = dbEvent.responseStatus;
      // schemaCastedDbObject.visibility = "default";
      schemaCastedDbObject.iCalUID = dbEvent.ICalUid;
      // schemaCastedDbObject.sequence = dbEvent.responseStatus;
      // schemaCastedDbObject.attendees = dbEvent.attendees;

      // schemaCastedDbObject.anyoneCanAddSelf = dbEvent.responseStatus;
      // schemaCastedDbObject.guestsCanInviteOthers = dbEvent.responseStatus;
      // schemaCastedDbObject.guestsCanModify = dbEvent.responseStatus;
      // schemaCastedDbObject.guestsCanSeeOtherGuests = dbEvent.responseStatus;
      // schemaCastedDbObject.privateCopy = dbEvent.responseStatus;
      // schemaCastedDbObject.locked = dbEvent.responseStatus;
      schemaCastedDbObject.allDay = dbEvent.IsAllDayEvent;

      // schemaCastedDbObject.calenderId = dbEvent.responseStatus;
      // schemaCastedDbObject.source = dbEvent.responseStatus;
      schemaCastedDbObject.providerType = EXCHANGE;
      return schemaCastedDbObject;
    default:
      console.log("Provider " + type + " not available");
  }
}
