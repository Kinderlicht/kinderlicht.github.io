import { EventAttributes } from "ics";

export type Event = EventAttributes;

export const events: Event[] = [
    {
        "start": [2024, 1, 3, 19, 0],
        "duration": { "hours": 3 },
        "startInputType": "local",
        "startOutputType": "local",
        "title": "Klimapuzzle",
        "description": "Lerne den Klimawandeln intuitiv verstehen beim 'Klimapuzzle'! Tauche ein in die faszinierende Welt des Klimaschutzes und sei dabei, wenn am 03.01.2024 in der Eventbar 'Woibadinga' das Klimapuzzle gelöst wird!",
        "location": "Eventbar Woibadinga, Deggendorfer Str. 12, 94522 Wallersdorf",
        "url": "https://association.climatefresk.org/training_sessions/7a6d156b-12ce-4da1-9d45-01ce2a871c47/show_public?language=en&tenant_token=36bd2274d3982262c0021755",
        "geo": { "lat": 48.740452, "lon": 12.7467539},
        "categories": ["Veranstaltung", "Klima", "Umwelt"],
        "status": "CONFIRMED",
        "busyStatus": "BUSY",
        "organizer": { "name": "Kinderlicht Wallersdorf e.V.", "email": "info@kinderlicht-wallersdorf.de" },
        "attendees": [
          { "name": "Kinderlicht Wallersdorf e.V.", "email": "info@kinderlicht-wallersdorf.de", "rsvp": true, "partstat": "ACCEPTED", "role": "REQ-PARTICIPANT" }
        ],
        "htmlContent": "Der dritte Schneeball des Kinderlicht Wallersdorf e.V. gemeinsam mit Kolping. Reservierungen bitte über den Anmeldebutton oben.",
    },
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
        "htmlContent": "Lerne den Klimawandeln intuitiv verstehen beim 'Klimapuzzle'! Tauche ein in die faszinierende Welt des Klimaschutzes und sei dabei, wenn am 03.01.2024 in der Eventbar 'Woibadinga' das Klimapuzzle gelöst wird! Reservierung über den Button oben.",
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
