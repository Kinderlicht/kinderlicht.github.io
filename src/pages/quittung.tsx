import React from "react";
import Layout from "../components/layout";
import DonationReceipt from "../components/confirmation_form";
import { HeadFC } from "gatsby";

export default function Home() {
  return (
    <Layout>
      <div className="site-page">
        <DonationReceipt />
      </div>
    </Layout>
  );
}

export const Head: HeadFC = () => (
  <title>Spendenquittung anfordern | Kinderlicht Wallersdorf</title>
);
