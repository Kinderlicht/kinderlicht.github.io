import React from "react";

export default function FormFail({ recover }: { recover: string }) {
  return (
    <>
      <div
        className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-900"
        role="alert"
      >
        <p className="font-bold">Ups...</p>
        <p>
          Leider konnten wir deine Nachricht nicht senden. Versuche es später
          noch einmal. Damit du nicht alles erneut ausfüllen musst, kannst du
          den folgenden Link anklicken.
        </p>
        <a
          className="mt-2 block font-semibold text-red-900 underline underline-offset-2 hover:text-red-950"
          href={`mailto:info@kinderlicht-wallersdorf.de?subject=Nachricht wiederherstellen.&body=Bitte diese E-Mail so abschicken: ${recover}`}
        >
          Eingegebene Daten per E-Mail an uns senden
        </a>
      </div>
    </>
  );
}
