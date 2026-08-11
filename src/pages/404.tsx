import * as React from "react";
import { Link, HeadFC, PageProps } from "gatsby";
import Layout from "../components/layout";

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <div className="site-page-narrow flex min-h-[60vh] items-center">
        <div className="site-card w-full p-8 text-center sm:p-12">
          <p className="site-eyebrow">Fehler 404</p>
          <h1 className="site-page-title">Seite nicht gefunden</h1>
          <p className="site-page-lead">
            Die gesuchte Seite existiert nicht oder wurde verschoben.
          </p>
          <Link to="/" className="site-button-primary mt-8">
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;

export const Head: HeadFC = () => (
  <title>Seite nicht gefunden | Kinderlicht Wallersdorf</title>
);
