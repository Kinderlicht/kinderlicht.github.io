import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createCalendarEvent } from "../src/content/events/calendar";
import EventDescription from "../src/components/event-description";
import RichText from "../src/components/rich-text";
import { safeWebUrl } from "../src/utils/safe-url";
import { parsePublicEvents } from "../src/content/events/events";

test("event descriptions preserve Markdown, HTML, and line breaks", () => {
  const html = renderToStaticMarkup(
    <EventDescription
      description={
        "🎄 **Weihnachtszauber!**\n\n📍 **Kirchenvorplatz**\n🕕 18:00 Uhr\n\n<em>Kommt vorbei!</em>"
      }
    />,
  );
  assert.match(html, /<strong>Weihnachtszauber!<\/strong>/);
  assert.match(html, /Kirchenvorplatz<\/strong><br\/>\n🕕/);
  assert.match(html, /<em>Kommt vorbei!<\/em>/);
  assert.equal((html.match(/<p>/g) || []).length, 3);
});

test("HTML descriptions take precedence with an empty-content fallback", () => {
  const html = renderToStaticMarkup(
    <EventDescription description="Fallback" htmlContent="<p>HTML</p>" />,
  );
  assert.match(html, /<p>HTML<\/p>/);
  assert.doesNotMatch(html, /Fallback/);
  assert.match(
    renderToStaticMarkup(<EventDescription htmlContent=" " description=" " />),
    /Es liegt keine Beschreibung vor\./,
  );
});

test("rich text removes executable HTML and unsafe URLs", () => {
  const input = `<script>alert(1)</script>
<style>body{display:none}</style>
<iframe src="https://example.org"></iframe>
<p onclick="alert(1)">Sicher</p>
<img src="x" onerror="alert(1)">
<a href="jav&#x61;script:alert(1)">Link</a>

[Link](javascript:alert%281%29)

<svg><a href="javascript:alert(1)">SVG</a></svg>`;
  for (const component of [
    <RichText>{input}</RichText>,
    <EventDescription description={input} />,
    <EventDescription htmlContent={input} />,
  ]) {
    const html = renderToStaticMarkup(component);
    assert.doesNotMatch(
      html,
      /<(script|style|iframe|svg)\b|onerror=|onclick=|javascript:|alert\(1\)/i,
    );
    assert.match(html, /<p>Sicher<\/p>/);
  }
});

test("news summaries preserve safe formatting, links, and entities", () => {
  const html = renderToStaticMarkup(
    <RichText>
      {
        'Kinder &amp; Familien: <strong>Danke!</strong> <a href="https://example.org">Mehr</a>'
      }
    </RichText>,
  );
  assert.match(html, /Kinder &amp; Familien/);
  assert.match(html, /<strong>Danke!<\/strong>/);
  assert.match(html, /<a href="https:\/\/example.org">Mehr<\/a>/);
});

test("registration links accept web URLs and reject executable schemes", () => {
  assert.equal(
    safeWebUrl("https://example.org/event?a=1"),
    "https://example.org/event?a=1",
  );
  assert.equal(
    safeWebUrl("/events/#1"),
    "https://www.kinderlicht-wallersdorf.de/events/#1",
  );
  assert.equal(safeWebUrl("http://example.org"), "http://example.org/");
  for (const value of [
    undefined,
    null,
    "",
    " ",
    "javascript:alert(1)",
    " JAVASCRIPT:alert(1)",
    "java\nscript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
    "https://[invalid",
  ]) {
    assert.equal(safeWebUrl(value), undefined, String(value));
  }
});

test("public events still parse and export calendar files", () => {
  const [event] = parsePublicEvents([
    {
      start: [2026, 12, 21, 18, 0],
      duration: { hours: 3, minutes: 0 },
      title: "Weihnachtsstand",
      description: "Kinderlicht Wallersdorf",
      location: "Kirchenvorplatz",
      status: "CONFIRMED",
    },
  ]);
  const result = createCalendarEvent({ ...event, eventId: 1 });
  assert.equal(result.error, null);
  assert.match(result.value!, /BEGIN:VEVENT/);
  assert.match(result.value!, /SUMMARY:Weihnachtsstand/);
  assert.match(result.value!, /DURATION:PT3H/);
});

test("calendar exports tolerate nullable GraphQL fields and remove unsafe URLs", () => {
  const [event] = parsePublicEvents([
    {
      start: [2026, 12, 21, 18, 0],
      duration: { hours: 3, minutes: 0 },
      title: "Weihnachtsstand",
      url: "javascript:alert(1)",
      geo: null,
      htmlContent: null,
      organizer: { name: "Kinderlicht", email: null },
      attendees: [{ name: "Gast", email: null, rsvp: null }],
    },
  ]);
  const result = createCalendarEvent({ ...event, eventId: 2 });
  assert.equal(result.error, null);
  assert.match(result.value!, /BEGIN:VEVENT/);
  assert.doesNotMatch(result.value!, /javascript:|eventId/);
});
