import { EventAttributes } from "ics";

export type Event = EventAttributes;

export const eventIsSoon = 1000 * 60 * 60 * 24 * 30;

export const events: Event[] = [
    {
        "start": [2023, 11, 18, 19, 0],
        "duration": { "hours": 6 },
        "startInputType": "local",
        "startOutputType": "local",
        "title": "Schneeball",
        "description": "Der dritte Schneeball des Kinderlicht Wallersdorf e.V. gemeinsam mit Kolping. Reservierungen per E-Mail an info@kinderlicht-wallersdorf.de",
        "location": "Pfarramt Wallersdorf, Marktpl. 22, 94522 Wallersdorf",
        "url": "https://form.campai.com/AuG6AHFMR5wK",
        "geo": { "lat": 48.73878611780747, "lon": 12.748386416519779},
        "categories": ["Veranstaltung", "Ball", "Tanzen"],
        "status": "CONFIRMED",
        "busyStatus": "BUSY",
        "organizer": { "name": "Kinderlicht Wallersdorf e.V.", "email": "info@kinderlicht-wallersdorf.de" },
        "attendees": [
          { "name": "Kinderlicht Wallersdorf e.V.", "email": "info@kinderlicht-wallersdorf.de", "rsvp": true, "partstat": "ACCEPTED", "role": "REQ-PARTICIPANT" }
        ],
        "htmlContent": "Der dritte Schneeball des Kinderlicht Wallersdorf e.V. gemeinsam mit Kolping. Reservierungen per <a href='mailto:info@kinderlicht-wallersdorf.de'>E-Mail</a>.",
    },
];
