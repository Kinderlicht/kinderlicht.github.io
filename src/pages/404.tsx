import * as React from "react";
import { Link, HeadFC, PageProps } from "gatsby";
import Layout from "../components/layout";

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <main className="h-screen w-full flex flex-col justify-center items-center bg-white">
        <h1 className="text-9xl font-extrabold text-gray-800 tracking-widest">
          404
        </h1>
        <div className="bg-orange-500 text-white px-2 text-sm rounded rotate-12 absolute">
          Seite nicht gefunden
        </div>
        <button className="mt-5">
          <a className="relative inline-block text-sm font-medium text-orange-500 group active:text-orange-600 focus:outline-none focus:ring">
            <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-orange-500 group-hover:translate-y-0 group-hover:translate-x-0"></span>

            <span className="relative block px-8 py-3 bg-white border border-orange-500 text-orange-500">
              <Link to="/">Zurück zur Startseite</Link>
            </span>
          </a>
        </button>
      </main>
    </Layout>
  );
};

export default NotFoundPage;

export const Head: HeadFC = () => <title>Kinderlicht Wallersdorf e.V.</title>;
