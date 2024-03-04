import React from "react";
import Layout from "../components/layout";
import ConcertForm from "../components/concert_form";
import { HeadFC } from "gatsby";

export default function Home() {
  return (
    <Layout>
      {/*<iframe src="https://form.campai.com/WbiKxBHbiKhh" className="h-screen w-full"/>*/}
      <div className="p-4 container max-w-6xl mx-auto space-y-6 sm:space-y-12 mb-8 mt-32">
        <h2 className="mb-16 text-3xl font-bold text-center">
          Konzert der{" "}
          <span className="text-primary dark:text-primary-400 no-underline">
            Filmmusik
          </span>
        </h2>
        <p className="prosa">
          Das berühmt berüchtigte Konzert der Filmmusik des Kinderlicht
          Wallersdorf e.V. ist zurück und geht in die zweite Runde!
        </p>
        <p>
          Hast du eine Band, spielst in einem Orchester oder bist ein
          Solokünstler und möchtest bei unserem Konzert der Filmmusik auftreten?
          Dann bist du hier genau richtig!
        </p>
        <p>
          Schreibe uns schnell und unverbindlich eine Nachricht und wir melden
          uns bei dir!
        </p>
        <ConcertForm />
      </div>
    </Layout>
  );
}

export const Head: HeadFC = () => <title>Konzert der Filmmusik</title>;
