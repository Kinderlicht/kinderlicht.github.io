import { Sponsor } from "../content/wir/sponsors";
import { Board } from "../content/wir/board";
import React from "react";
import { HeadFC, graphql } from "gatsby";
import Layout from "../components/layout";
import { GatsbyImage } from "gatsby-plugin-image";
import { PageHeader, PageSectionHeader } from "../components/page";

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <article className="h-full">
      <a
        href={sponsor.link}
        aria-label={`${sponsor.name}: Website öffnen`}
        className="block h-full rounded-2xl"
      >
        <div className="site-card site-card-interactive h-full dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600">
          <div className="p-6">
            <div className="flex flex-wrap items-center">
              <div className="flex-basis shrink-0 grow-0 px-3 w-5/12">
                {sponsor.image && sponsor.image.childImageSharp && (
                  <GatsbyImage
                    className="mb-6 dark:brightness-150 lg:mb-0 h-24 object-contain"
                    image={sponsor.image.childImageSharp.gatsbyImageData}
                    alt=""
                    objectFit="contain"
                  />
                )}
                {sponsor.image &&
                  sponsor.image.extension === "svg" &&
                  sponsor.image.publicURL && (
                    <img
                      src={sponsor.image.publicURL}
                      alt=""
                      className="mb-6 dark:brightness-150 lg:mb-0 h-24 object-contain"
                    />
                  )}
                {sponsor.externalImage && (
                  <img
                    src={sponsor.externalImage}
                    alt=""
                    className="mb-6 dark:brightness-150 lg:mb-0 h-24 object-contain"
                  />
                )}
              </div>
              <div className="flex-basis shrink-0 grow-0 px-3 w-7/12">
                <h3 className="mb-1 font-bold">{sponsor.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {sponsor.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </a>
    </article>
  );
}

function BoardMemberCard({ member }: { member: Board }) {
  return (
    <article className="site-card h-full p-6 text-center dark:border-neutral-600 dark:bg-neutral-700 dark:text-white">
      <div className="flex justify-center">
        <div className="flex h-32 w-32 justify-center overflow-hidden rounded-full bg-slate-100">
          <GatsbyImage
            className="h-full w-full"
            image={member.image.childImageSharp.gatsbyImageData}
            alt={`Porträt von ${member.name}`}
          />
        </div>
      </div>
      <div className="pt-5">
        <div className="mb-4 flex items-center justify-center gap-2">
          <h2 className="text-lg font-bold">{member.name}</h2>
          <a
            href={`mailto:${member.email}`}
            aria-label={`E-Mail an ${member.name} schreiben`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-orange-700 hover:bg-orange-50 hover:text-orange-800 dark:text-orange-300 dark:hover:bg-neutral-600 dark:hover:text-orange-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              width="16"
              height="16"
              fill="currentColor"
              className="h-5 w-5"
              viewBox="0 0 16 16"
            >
              <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2H2Zm-2 9.8V4.698l5.803 3.546L0 11.801Zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 9.671V4.697l-5.803 3.546.338.208A4.482 4.482 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671Z" />
              <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034v.21Zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791Z" />
            </svg>
          </a>
        </div>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          {member.role}
        </p>
      </div>
    </article>
  );
}

export default function Home({
  data: { sponsors, boards },
}: {
  data: { sponsors: { nodes: Sponsor[] }; boards: { nodes: Board[] } };
}) {
  return (
    <Layout>
      <div className="site-page">
        <PageHeader
          eyebrow="Über uns"
          title="Unsere Vorstandschaft"
          description="Die Menschen hinter Kinderlicht, die unsere Projekte organisieren und gemeinsam mit vielen Mitgliedern möglich machen."
        />

        <section>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {boards.nodes.map((member, index) => (
              <BoardMemberCard member={member} key={index} />
            ))}
          </div>
        </section>

        <section className="site-section">
          <PageSectionHeader
            centered
            eyebrow="Gemeinsam stark"
            title="Unsere Unterstützer"
            description="Die Reihenfolge der Unterstützer wird täglich neu gemischt."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Sponsors are randomly sorted based on today's date */}
            {[...sponsors.nodes]
              .sort((a, b) => {
                const today = new Date().toDateString();
                const seedA = today + a.name;
                const seedB = today + b.name;
                const hashA = seedA
                  .split("")
                  .reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const hashB = seedB
                  .split("")
                  .reduce((acc, char) => acc + char.charCodeAt(0), 0);
                return hashA - hashB;
              })
              .map((sponsor, index) => (
                <SponsorCard sponsor={sponsor} key={index} />
              ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}

export const indexQuery = graphql`
  query boardQueryAndSponsorQuery {
    sponsors: allSponsor {
      nodes {
        name
        location
        link
        externalImage
        image {
          publicURL
          extension
          childImageSharp {
            gatsbyImageData(
              placeholder: BLURRED
              formats: [AUTO, WEBP]
              layout: FULL_WIDTH
            )
          }
        }
      }
    }
    boards: allBoard {
      nodes {
        name
        role
        email
        image {
          childImageSharp {
            gatsbyImageData(
              placeholder: BLURRED
              formats: [AUTO, WEBP]
              layout: FULL_WIDTH
            )
          }
        }
      }
    }
  }
`;

export const Head: HeadFC = () => (
  <title>Über uns | Kinderlicht Wallersdorf</title>
);
