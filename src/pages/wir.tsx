import { Sponsor } from "../content/wir/sponsors";
import { Board } from "../content/wir/board";
import React from "react";
import { HeadFC, Link, graphql } from "gatsby";
import Layout from "../components/layout";
import { GatsbyImage } from "gatsby-plugin-image";

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <div>
      <a href={sponsor.link} className="mb-6 lg:mb-0">
        <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] w-full h-full  dark:bg-neutral-700 hover:bg-gray-100">
          <div className="p-6">
            <div className="flex flex-wrap items-center">
              <div className="flex-basis shrink-0 grow-0 px-3 w-5/12">
                {sponsor.image && (
                  <GatsbyImage
                    className="mb-6 dark:brightness-150 lg:mb-0 h-24 object-contain"
                    image={sponsor.image.childImageSharp.gatsbyImageData}
                    alt={sponsor.name}
                    objectFit="contain"
                  />
                )}
                {sponsor.externalImage && (
                  <img
                    src={sponsor.externalImage}
                    alt={sponsor.name}
                    className="mb-6 dark:brightness-150 lg:mb-0 h-24 object-contain"
                  />
                )}
              </div>
              <div className="flex-basis shrink-0 grow-0 px-3 w-7/12">
                <h5 className="mb-4 font-bold">{sponsor.name}</h5>
                {sponsor.location}
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

function Statistic() {
  return (
    <div className="md:px-24 lg:px-8 lg:py-20">
      <div className="flex flex-col lg:items-center lg:flex-row">
        <div className="flex items-center mb-6 lg:mb-0 container">
          <div className="flex items-center justify-center w-16 h-16 mr-5 rounded-full bg-primary xl:mr-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="w-8 h-8 bi bi-person-add text-gray-800"
              viewBox="0 0 16 16"
            >
              <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
              <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z" />
            </svg>
          </div>
          <h3 className="text-2xl text-gray-800 font-extrabold">
            ... und über 60 weitere Mitglieder.
          </h3>
        </div>
      </div>
    </div>
  );
}

function BoardMemberCard({ member }: { member: Board }) {
  return (
    <div className="mb-24 md:mb-0">
      <div className="block h-full rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] w-full  dark:bg-neutral-700">
        <div className="flex justify-center">
          <div className="flex justify-center -mt-[75px]">
            <GatsbyImage
              className="rounded-full overflow-hidden w-80 hover:animate-pulse"
              image={member.image.childImageSharp.gatsbyImageData}
              alt={member.name}
            />
          </div>
        </div>
        <div className="p-6">
          <h5 className="mb-4 text-lg font-bold">
            {member.name}
            <Link
              to={`mailto:${member.email}`}
              className="px-2"
              activeClassName="inline-block"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="h-4 w-4 text-primary dark:text-primary-400 inline-block hover:animate-bounce"
                viewBox="0 0 16 16"
              >
                <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2H2Zm-2 9.8V4.698l5.803 3.546L0 11.801Zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 9.671V4.697l-5.803 3.546.338.208A4.482 4.482 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671Z" />
                <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034v.21Zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791Z" />
              </svg>
            </Link>
          </h5>
          <p className="mb-6">{member.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home({
  data: { sponsors, boards },
}: {
  data: { sponsors: { nodes: Sponsor[] }; boards: { nodes: Board[] } };
}) {
  return (
    <Layout>
      <div className="p-4 container max-w-8xl mx-auto space-y-6 sm:space-y-12 mb-8 mt-32">
        <section className="mb-32 text-center">
          <h2 className="mb-32 text-3xl font-bold">
            Unsere{" "}
            <span className="text-primary dark:text-primary-400 no-underline">
              Vorstandschaft
            </span>
          </h2>

          <div className="grid md:grid-rows-3 md:grid-cols-2 xl:grid-rows-2 xl:grid-cols-3 gap-y-24 gap-x-8">
            {boards.nodes.map((member, index) => (
              <BoardMemberCard member={member} key={index} />
            ))}
          </div>
          
        </section>

        <div className="container my-24 mx-auto md:px-6">
          <h2 className="mb-2 text-3xl font-bold text-center">
            Unsere{" "}
            <span className="text-primary dark:text-primary-400 no-underline">
              Unterstützer
            </span>
          </h2>
          <p className="mb-16 text-center">
            Die Sortierung der Unterstützer erfolgte rein zufällig.
          </p>

          <div className="grid gap-6 lg:grid-cols-3">
            {sponsors.nodes.map((sponsor, index) => (
              <SponsorCard sponsor={sponsor} key={index} />
            ))}
          </div>
        </div>
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

export const Head: HeadFC = () => <title>Kinderlicht</title>;
