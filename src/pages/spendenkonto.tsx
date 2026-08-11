import React from "react";
import Layout from "../components/layout";
import { HeadFC } from "gatsby";
import DonationAccount from "../components/modals";

export default function Home() {
  return (
    <Layout>
      <div className="p-4 container max-w-6xl mx-auto space-y-6 sm:space-y-12 mb-8 mt-32">
        <h1 className="mb-16 text-3xl font-bold text-center">
          Unser{" "}
          <u className="text-orange-700 dark:text-orange-400 no-underline">
            Spendenkonto
          </u>
        </h1>
        <DonationAccount />
      </div>
    </Layout>
  );
}

export const Head: HeadFC = () => (
  <title>Spendenkonto | Kinderlicht Wallersdorf</title>
);
