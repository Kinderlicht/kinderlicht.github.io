import React from "react";
import Layout from "../../components/layout";
import MemberForm from "../../components/member_form";
import { HeadFC } from "gatsby";

export default function Home() {
  return (
    <Layout>
      <div className="container mx-auto mb-8 mt-24 max-w-6xl p-4 sm:mt-32">
        <MemberForm />
      </div>
    </Layout>
  );
}

export const Head: HeadFC = () => (
  <title>Mitglied werden | Kinderlicht Wallersdorf</title>
);
