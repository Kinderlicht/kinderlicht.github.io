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
    <article className="site-card flex h-full flex-col p-6 text-center dark:border-neutral-600 dark:bg-neutral-700 dark:text-white">
      <div className="flex justify-center">
        <div className="flex h-32 w-32 justify-center overflow-hidden rounded-full bg-slate-100">
          <GatsbyImage
            className="h-full w-full"
            image={member.image.childImageSharp.gatsbyImageData}
            alt={`Porträt von ${member.name}`}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center pt-5">
        <h2 className="max-w-full break-words text-lg font-bold leading-snug text-slate-950 [text-wrap:balance]">
          {member.name}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {member.role}
        </p>
        <div className="mt-auto pt-4">
          <a
            href={`mailto:${member.email}`}
            aria-label={`E-Mail an ${member.name} schreiben`}
            className="site-button-secondary gap-2 px-4 py-2 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              width="16"
              height="16"
              fill="currentColor"
              className="h-4 w-4 flex-none text-orange-700"
              viewBox="0 0 16 16"
            >
              <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697Zm6.761 4.132L.191 12.856A2 2 0 0 0 2 14h12a2 2 0 0 0 1.809-1.144L9.239 8.83 8 9.586 6.761 8.83ZM10.197 8.243 16 11.801V4.697l-5.803 3.546Z" />
            </svg>
            <span>E-Mail schreiben</span>
          </a>
        </div>
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
