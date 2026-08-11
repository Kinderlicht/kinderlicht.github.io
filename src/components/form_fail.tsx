import React from "react";

export default function FormFail({ recover }: { recover: string }) {
  return (
    <>
      <div
        className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
        role="alert"
      >
        <p className="font-bold">Ups...</p>
        <p>
          Leider konnten wir deine Nachricht nicht senden. Versuche es später
          noch einmal. Damit du nicht alles erneut ausfüllen musst, kannst du
          den folgenden Link anklicken.
        </p>
        <a
          className="mt-2 block text-red-900 underline underline-offset-2 hover:text-red-950"
          href={`mailto:info@kinderlicht-wallersdorf.de?subject=Nachricht wiederherstellen.&body=Bitte diese E-Mail so abschicken: ${recover}`}
        >
          Eingegebene Daten per E-Mail an uns senden
        </a>
      </div>
    </>
  );
}
