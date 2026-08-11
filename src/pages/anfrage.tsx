import React from "react";
import { HeadFC } from "gatsby";
import Layout from "../components/layout";
import ContactForm from "../components/contact_form";
import { PageHeader } from "../components/page";

const helpPortalUrl =
  "https://portal.kinderlicht-wallersdorf.de/anfrage-formular";

function HelpIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s-7.5-4.35-7.5-10.2A4.8 4.8 0 0 1 12 6.82a4.8 4.8 0 0 1 7.5 3.98C19.5 16.65 12 21 12 21Z"
      />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 8.25h9m-9 3.5h6M5.25 18.5l-2 1 1-3.25A8.25 8.25 0 1 1 12 20.25a8.2 8.2 0 0 1-4.5-1.35"
      />
    </svg>
  );
}

export default function RequestPage() {
  return (
    <Layout>
      <div className="site-page max-w-5xl">
        <PageHeader
          eyebrow="Kontakt & Hilfe"
          title="Wie können wir dir helfen?"
          description="Wähle einfach den Weg, der zu deinem Anliegen passt."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <section className="site-card flex h-full flex-col border-orange-200 p-6 sm:p-8">
            <div className="site-icon">
              <HelpIcon />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Du brauchst konkrete Hilfe?
            </h2>
            <p className="mt-3 flex-1 leading-7 text-gray-600">
              Für finanzielle Unterstützung, Sachleistungen oder andere direkte
              Hilfe nutze bitte unser Hilfe-Portal.
            </p>
            <a
              href={helpPortalUrl}
              className="site-button-primary mt-6 min-h-12"
            >
              Hilfe anfragen
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </a>
          </section>

          <section className="site-card flex h-full flex-col p-6 sm:p-8">
            <div className="site-icon bg-slate-100 text-slate-700">
              <MessageIcon />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Du möchtest uns kontaktieren?
            </h2>
            <p className="mt-3 flex-1 leading-7 text-gray-600">
              Für allgemeine Fragen, Ideen, Veranstaltungen oder sonstige
              Anliegen schreib uns über das Kontaktformular.
            </p>
            <a
              href="#kontaktformular"
              className="site-button-secondary mt-6 min-h-12"
            >
              Kontakt aufnehmen
              <span aria-hidden="true" className="ml-2">
                ↓
              </span>
            </a>
          </section>
        </div>

        <section
          id="kontaktformular"
          aria-labelledby="kontaktformular-heading"
          className="site-section scroll-mt-36"
        >
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h2 id="kontaktformular-heading" className="site-section-title">
              Allgemeine Nachricht
            </h2>
            <p className="mt-3 leading-7 text-gray-600">
              Hier kannst du uns eine Frage stellen oder etwas mitteilen. Für
              konkrete Hilfe nutze bitte das Hilfe-Portal oben.
            </p>
          </div>
          <ContactForm />
        </section>
      </div>
    </Layout>
  );
}

export const Head: HeadFC = () => (
  <>
    <title>Kontakt &amp; Hilfe | Kinderlicht Wallersdorf</title>
    <meta
      name="description"
      content="Kontaktiere Kinderlicht Wallersdorf oder stelle eine konkrete Hilfsanfrage über unser Hilfe-Portal."
    />
  </>
);
