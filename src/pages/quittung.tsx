import React from "react";
import Layout from "../components/layout";
import DonationReceipt from "../components/confirmation_form";
import { HeadFC } from "gatsby";

export default function Home() {
  return (
    <Layout>
      <div className="container mx-auto mb-8 mt-24 max-w-6xl p-4 sm:mt-32">
        <DonationReceipt />
      </div>
    </Layout>
  );
}

export const Head: HeadFC = () => (
  <title>Spendenquittung anfordern | Kinderlicht Wallersdorf</title>
);
