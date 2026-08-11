import React from "react";

function DonationAccount() {
  const iban = "DE04 7419 1000 0007 7243 14";
  const [copyStatus, setCopyStatus] = React.useState("");

  const copyIban = async () => {
    try {
      await navigator.clipboard.writeText(iban);
      setCopyStatus("IBAN wurde kopiert.");
    } catch {
      setCopyStatus("IBAN konnte nicht kopiert werden.");
    }
  };

  return (
    <section
      aria-labelledby="donation-account-heading"
      className="relative p-6"
    >
      <h2 id="donation-account-heading" className="text-xl font-semibold">
        Bankverbindung
      </h2>
      <dl className="my-4 grid gap-3 text-lg leading-relaxed sm:grid-cols-[auto_1fr]">
        <dt className="font-semibold">Bank</dt>
        <dd>VR Bank Landau-Mengkofen eG</dd>
        <dt className="font-semibold">IBAN</dt>
        <dd className="break-all font-mono">{iban}</dd>
        <dt className="font-semibold">BIC</dt>
        <dd className="font-mono">GENODEF1LND</dd>
      </dl>
      <button
        className="min-h-11 rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-900"
        type="button"
        onClick={copyIban}
        aria-describedby="donation-copy-status"
      >
        IBAN kopieren
      </button>
      <p
        id="donation-copy-status"
        className="mt-3 text-sm text-gray-700"
        aria-live="polite"
      >
        {copyStatus}
      </p>
    </section>
  );
}

export default DonationAccount;
