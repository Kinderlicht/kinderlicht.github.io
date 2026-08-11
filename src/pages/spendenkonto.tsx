import React from "react";
import Layout from "../components/layout";
import { HeadFC } from "gatsby";
import DonationAccount from "../components/modals";
import { PageHeader } from "../components/page";

export default function Home() {
  return (
    <Layout>
      <div className="site-page-narrow">
        <PageHeader
          eyebrow="Spenden"
          title="Unser Spendenkonto"
          description="Mit deiner Spende unterstützt du Kinder und Familien in unserer Region direkt und unbürokratisch."
        />
        <DonationAccount />
      </div>
    </Layout>
  );
}

export const Head: HeadFC = () => (
  <title>Spendenkonto | Kinderlicht Wallersdorf</title>
);
