import React from "react";

export default function FormSuccess() {
  return (
    <div
      className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-emerald-950"
      role="status"
      aria-live="polite"
    >
      <div className="flex">
        <div className="py-1">
          <svg
            aria-hidden="true"
            className="mr-4 h-6 w-6 fill-current text-emerald-700"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
          </svg>
        </div>
        <div>
          <p className="font-bold">Nur noch ein Schritt...</p>
          <p className="text-sm">
            Vielen Dank für dein Interesse! Du solltest eine E-Mail erhalten
            haben, die du bestätigen musst. Bitte überprüfe auch deinen
            SPAM-Ordner.
          </p>
        </div>
      </div>
    </div>
  );
}
