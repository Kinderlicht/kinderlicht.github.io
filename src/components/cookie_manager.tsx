import React from "react";
import Cookies from "js-cookie";

export function queryConsent() {
  return Cookies.get("consent") !== undefined && Cookies.get("consent") == "true";
}

export function handleCookies(content: [string], setConsent: CallableFunction) {
  let [currConsent, setCurrConsent] = React.useState(queryConsent());
  if (currConsent) {
    return (<></>);
  }
  const handleAccept = () => {
    setConsent(true);
    setCurrConsent(true);
    // Set the consent cookie value
    Cookies.set("consent", "true", { expires: 365 }); // Expires in 1 year
    // Set cookie or perform other actions
  };
  return (
    <div>
        Diese Website verwendet Cookies, um Inhalte und Funktionen
        bereitzustellen. Inhalte von externen Webseiten (z. B. Bilder) werden
        eingebunden, und Formulare werden an die Vereinssoftware Campai
        übermittelt. Weitere Informationen finden Sie in unserer{" "}
        <a href="/rechtliches">Datenschutzerklärung</a>. Bitte geben Sie uns
        Ihre Zustimmung, um die verborgenen Inhalte auf dieser Seite
        anzuzeigen. Folgende Inhalte sind verborgen:
        <ul>
        {content.map((c, index) => (
            <li key={index}>{c}</li>
        ))}
        </ul>
        <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2"
            onClick={handleAccept}
        >
            Jetzt zustimmen.
        </button>
    </div>
  );
}
