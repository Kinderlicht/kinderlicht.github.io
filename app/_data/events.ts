import { EventAttributes } from "ics";

export type Event = EventAttributes;

export const events: Event[] = [
    {
        "start": [2023, 11, 18, 19, 0],
        "duration": { "hours": 6 },
        "startInputType": "local",
        "startOutputType": "local",
        "title": "Schneeball",
        "description": "Der dritte Schneeball des Kinderlicht Wallersdorf e.V. gemeinsam mit Kolping. Reservierungen per <a href='mailto:info@kinderlicht-wallersdorf.de'>E-Mail</a>",
        "location": "Pfarramt Wallersdorf, Marktpl. 22, 94522 Wallersdorf",
        "url": "http://localhost:3000/events",
        "geo": { "lat": 48.73878611780747, "lon": 12.748386416519779},
        "categories": ["Veranstaltung", "Ball", "Tanzen"],
        "status": "CONFIRMED",
        "busyStatus": "BUSY",
        "organizer": { "name": "Kinderlicht Wallersdorf e.V.", "email": "info@kinderlicht-wallersdorf.de" },
        "attendees": [
          { "name": "Kinderlicht Wallersdorf e.V.", "email": "info@kinderlicht-wallersdorf.de", "rsvp": true, "partstat": "ACCEPTED", "role": "REQ-PARTICIPANT" }
        ]
    },
    {
        "start": [2023, 12, 1, 18, 30],
        "duration": { "hours": 2 },
        "startInputType": "local",
        "startOutputType": "local",
        "title": "Bender's Binge-Watching Bonanza",
        "description": "Join us for a night of binge-watching Futurama with Bender Rodriguez. BYOB (Bring Your Own Bender).",
        "location": "Planet Express Ship, Dock 12, New New York",
        "url": "http://localhost:3000/events",
        "geo": { "lat": 40.7142691, "lon": -74.0059729 },
        "categories": ["TV Night", "Robot Party"],
        "status": "CONFIRMED",
        "busyStatus": "BUSY",
        "organizer": { "name": "Bender Rodriguez", "email": "bender@planetexpress.com" },
        "attendees": [
            { "name": "Fry", "email": "fry@planetexpress.com", "rsvp": true, "partstat": "ACCEPTED", "role": "REQ-PARTICIPANT" },
            { "name": "Leela", "email": "leela@planetexpress.com", "rsvp": true, "partstat": "ACCEPTED", "role": "REQ-PARTICIPANT" },
            { "name": "Hermes", "email": "hermes@planetexpress.com", "rsvp": true, "partstat": "ACCEPTED", "role": "REQ-PARTICIPANT" },
        ]
    },
    {
        "start": [2023, 12, 5, 16, 0],
        "duration": { "hours": 3 },
        "startInputType": "local",
        "startOutputType": "local",
        "title": "Zoidberg's Crab Feast",
        "description": "Join Dr. Zoidberg for a delicious crab feast. Bring your own shell crackers!",
        "location": "Fishy Joe's, Crab Town, Decapod 10",
        "url": "http://localhost:3000/events",
        "geo": { "lat": -0.114132, "lon": 60.166184 },
        "categories": ["Seafood", "Crab Fest"],
        "status": "CONFIRMED",
        "busyStatus": "BUSY",
        "organizer": { "name": "Dr. Zoidberg", "email": "zoidberg@planetexpress.com" },
        "attendees": [
            { "name": "Fry", "email": "fry@planetexpress.com", "rsvp": true, "partstat": "ACCEPTED", "role": "REQ-PARTICIPANT" },
            { "name": "Hermes", "email": "hermes@planetexpress.com", "rsvp": true, "partstat": "ACCEPTED", "role": "REQ-PARTICIPANT" },
            { "name": "Amy", "email": "amy@planetexpress.com", "rsvp": true, "partstat": "ACCEPTED", "role": "REQ-PARTICIPANT" },
        ]
    },
    {
        "start": [2024, 1, 15, 20, 0],
        "duration": { "hours": 4 },
        "startInputType": "local",
        "startOutputType": "local",
        "title": "Professor Farnsworth's Science Symposium",
        "description": "A night of scientific discoveries and experiments with Professor Farnsworth. Bring your own lab coat and goggles!",
        "location": "Planet Express Lab, Mars University",
        "url": "http://localhost:3000/events",
        "geo": { "lat": -35.3075, "lon": -149.1244 },
        "categories": ["Science", "Symposium"],
        "status": "CONFIRMED",
        "busyStatus": "BUSY",
        "organizer": { "name": "Professor Farnsworth", "email": "professor@planetexpress.com" },
        "attendees": [
            { "name": "Bender", "email": "bender@planetexpress.com", "rsvp": true, "partstat": "ACCEPTED", "role": "REQ-PARTICIPANT" },
            { "name": "Leela", "email": "leela@planetexpress.com", "rsvp": true, "partstat": "ACCEPTED", "role": "REQ-PARTICIPANT" },
            { "name": "Scruffy", "email": "scruffy@planetexpress.com", "rsvp": true, "partstat": "ACCEPTED", "role": "REQ-PARTICIPANT" },
        ]
    },
    {
        "start": [2024, 2, 10, 19, 30],
        "duration": { "hours": 2 },
        "startInputType": "local",
        "startOutputType": "local",
        "title": "Fry's 20th Century Nostalgia Night",
        "description": "Relive the 20th century with Fry! Bring your 20th-century memorabilia and be ready for nostalgia.",
        "location": "Fry's Apartment, Robot Arms Apts, New New York",
        "url": "http://localhost:3000/events",
        "geo": { "lat": 40.7128, "lon": -74.0060 },
        "categories": ["Nostalgia", "Time Travel"],
        "status": "CONFIRMED",
        "busyStatus": "BUSY",
        "organizer": { "name": "Fry", "email": "fry@planetexpress.com" },
        "attendees": [
            { "name": "Leela", "email": "leela@planetexpress.com", "rsvp": true, "partstat": "ACCEPTED", "role": "REQ-PARTICIPANT" },
            { "name": "Hermes", "email": "hermes@planetexpress.com", "rsvp": true, "partstat": "ACCEPTED", "role": "REQ-PARTICIPANT" },
            { "name": "Amy", "email": "amy@planetexpress.com", "rsvp": true, "partstat": "ACCEPTED", "role": "REQ-PARTICIPANT" },
        ]
    },
];