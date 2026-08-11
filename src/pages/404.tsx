import * as React from "react";
import { Link, HeadFC, PageProps } from "gatsby";
import Layout from "../components/layout";

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <div className="min-h-[70vh] w-full flex flex-col justify-center items-center bg-white">
        <h1 className="text-9xl font-extrabold text-gray-800 tracking-widest">
          404
        </h1>
        <div className="bg-orange-700 text-white px-2 text-sm rounded rotate-12 absolute">
          Seite nicht gefunden
        </div>
        <Link
          to="/"
          className="mt-8 inline-flex min-h-11 items-center rounded-xl bg-orange-700 px-6 py-3 font-bold text-white hover:bg-orange-800"
        >
          Zurück zur Startseite
        </Link>
      </div>
    </Layout>
  );
};

export default NotFoundPage;

export const Head: HeadFC = () => (
  <title>Seite nicht gefunden | Kinderlicht Wallersdorf</title>
);
