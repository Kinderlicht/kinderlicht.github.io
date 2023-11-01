import { EventAttributes } from "ics";

export type Event = EventAttributes;

export const events: Event[] = [
    {
        "start": [2023, 11, 18, 19, 0],
        "duration": { "hours": 6 },
        "startInputType": "local",
        "startOutputType": "local",
        "title": "Schneeball",
        "description": "Der dritte Schneeball des Kinderlicht Wallersdorf e.V. gemeinsam mit Kolping. Reservierungen per E-Mail an info@kinderlicht-wallersdorf.de",
        "location": "Pfarramt Wallersdorf, Marktpl. 22, 94522 Wallersdorf",
        "url": "https://form.campai.com/2UDVjKg6BbDW",
        "geo": { "lat": 48.73878611780747, "lon": 12.748386416519779},
        "categories": ["Veranstaltung", "Ball", "Tanzen"],
        "status": "CONFIRMED",
        "busyStatus": "BUSY",
        "organizer": { "name": "Kinderlicht Wallersdorf e.V.", "email": "info@kinderlicht-wallersdorf.de" },
        "attendees": [
          { "name": "Kinderlicht Wallersdorf e.V.", "email": "info@kinderlicht-wallersdorf.de", "rsvp": true, "partstat": "ACCEPTED", "role": "REQ-PARTICIPANT" }
        ],
        "htmlContent": "Der dritte Schneeball des Kinderlicht Wallersdorf e.V. gemeinsam mit Kolping. Reservierungen bitte über den Anmeldebutton oben.",
    },
];

const dateFromArray = (date: number[]) => new Date(date.join("-"));
export const eventIsSoon = 1000 * 60 * 60 * 24 * 30;
export const numberOfUpcomingEvents = events.filter(
  (evt) =>
    dateFromArray(evt["start"].slice(0, 3)) >
      new Date() &&
    dateFromArray(evt["start"].slice(0, 3)).getTime() -
      new Date().getTime() <
      eventIsSoon
).length;