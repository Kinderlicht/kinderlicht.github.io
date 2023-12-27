import React from "react";

function DonationAccountModal() {
  const iban = "DE04 7419 1000 0007 7243 14";

  return (
    <div className="relative p-6 flex-auto">
      <div className="my-4 text-blueGray-500 text-lg leading-relaxed">
        <strong className="font-semibold">Unser Spendenkonto: </strong>

        <div title="Bank">VR Bank Landau-Mengkofen eG </div>

        <div title="IBAN">{iban} </div>

        <div title="BIC">GENODEF1LND </div>
      </div>
      <button
        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => navigator.clipboard.writeText(iban)}
      >
        Kopieren
      </button>
    </div>
  );
}

export default DonationAccountModal;
