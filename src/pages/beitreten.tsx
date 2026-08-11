import React from "react";
import Layout from "../components/layout";
import MemberForm from "../components/member_form";
import { HeadFC } from "gatsby";

export default function Home() {
  return (
    <Layout>
      <div className="site-page">
        <MemberForm />
      </div>
    </Layout>
  );
}

export const Head: HeadFC = () => (
  <title>Mitglied werden | Kinderlicht Wallersdorf</title>
);
