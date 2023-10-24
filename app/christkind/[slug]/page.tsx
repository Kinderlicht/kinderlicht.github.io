"use client";

import Link from "next/link";
import { useState } from "react";
import { MouseEvent } from "react";

const Home = ({ params: { slug } }: { params: { slug: number } }) => {
  let [email, setEmail] = useState<string>("");
  let [message, setText] = useState<string>("");
  let [err, setErr] = useState<number>(-1);

  const valid = slug == 1 || slug == 14389;

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetch("https://api.campai.com/formSubmissions/6536c50d26e1924cfba8d412", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        formData: { wunsch: "" + slug, erklaerung: message, mail: email },
        confirmationMail: email,
      }),
    })
      .then((res) => res.json())
      .then((_) => {
        setEmail("");
        setText("");
        setErr(0);
      })
      .catch((_) => {
        setEmail("");
        setText("");
        setErr(1);
      });
  };

  return (
    <div className="container max-w-6xl mx-auto space-y-6 sm:space-y-12 mb-8 mt-32">
      <h2 className="mb-16 text-3xl font-bold text-center">
        Deine Wunschnummer ist{" "}
        <u className="text-primary dark:text-primary-400 no-underline">
          {slug}
        </u>
      </h2>

      {!valid ? (
        <div className="container  mb-8 mt-32 mx-auto">
          <section className="mb-32 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Diese Wunsch-ID existiert leider{" "}
              <u className="text-primary dark:text-primary-400 no-underline">
                nicht.
              </u>
            </h2>
            <Link className="text-primary hover:underline" href="/christkind">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="inline-block bi bi-arrow-left-circle"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
                />
              </svg>{" "}
              Zurück zur manuellen Eingabe.
            </Link>
          </section>
        </div>
      ) : (
        <p className="mb-2 text-1xl text-center font-bold mt-8">
          Herzlichen Dank für deine Mithilfe in unserer gemeinsamen
          Weihnachtsaktion! Bitte fülle die untenstehenden Felder aus.
        </p>
      )}
      <form className={valid && err == -1 ? "" : "hidden"}>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Deine E-Mail
          </label>
          <input
            type="email"
            id="email"
            onChange={(t) => setEmail(t.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="christkind@nordpol.de"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="text"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Deine Nachricht an uns.
          </label>
          <textarea
            id="text"
            onChange={(t) => setText(t.target.value)}
            className="h-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          onClick={(e) => handleSubmit(e)}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Abschicken
        </button>
      </form>
      {err == 0 && (
        <div
          className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-teal-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Nur noch ein Schritt...</p>
              <p className="text-sm">
                Vielen Dank für deine Mithilfe! Du solltest eine E-Mail erhalten
                haben, die Du bestätigen musst. Bitte überprüfe auch deinen
                SPAM-Ordner.
              </p>
            </div>
          </div>
        </div>
      )}
      {err == 1 && (
        <div
          className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
          role="alert"
        >
          <p className="font-bold">Ups...</p>
          <p>
            Leider konnten wir deinen Antrag nicht bearbeiten, versuche es
            später nochmal.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
