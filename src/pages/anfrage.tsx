import React from "react";
import Layout from "../components/layout";
import ContactForm from "../components/contact_form";
import { HeadFC } from "gatsby";

export default function Home() {
  return (
    <Layout>
    {/*<iframe src="https://form.campai.com/WbiKxBHbiKhh" className="h-screen w-full"/>*/}
    <div className="p-4 container max-w-6xl mx-auto space-y-6 sm:space-y-12 mb-8 mt-32">
      <h2 className="mb-16 text-3xl font-bold text-center">
        Kontaktiere{" "}
        <span className="text-primary dark:text-primary-400 no-underline">
          uns
        </span>
      </h2>
    <ContactForm/>
      </div>
    </Layout>
  );
}

export const Head: HeadFC = () => <title>Kinderlicht</title>;