import React from "react";
import { Link } from "gatsby";

export default function FormFail({ recover }: { recover: string }) {
  return (
    <>
      <div
        className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
        role="alert"
      >
        <p className="font-bold">Ups...</p>
        <p>
          Leider konnten wir deinen Antrag nicht bearbeiten, versuche es später
          nochmal.
        Damit du nicht nochmal alles ausfüllen musst, kannst du den folgenden
        Link anklicken.
        </p>
        <Link
            className="block hover:underline text-red-900 mt-2 italic"
          to={`mailto:info@kinderlicht-wallersdorf.de?subject=Antrag wiederherstellen.&body=Bitte diese E-Mail so abschicken: ${recover}`}
        >
          Klicke hier, um deine eingegebenen Daten per E-Mail an uns zu senden.
        </Link>
      </div>
    </>
  );
}
