import { Sponsor } from "../content/wir/sponsors";
import { BoardMember, board_members } from "../content/wir/board";
import React from "react";
import { Link, graphql } from "gatsby";
import Layout from "../components/layout";
import { GatsbyImage, StaticImage } from "gatsby-plugin-image";

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <div>
      <a href={sponsor.link} className="mb-6 lg:mb-0">
        <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] w-full h-full  dark:bg-neutral-700 hover:bg-gray-100">
          <div className="p-6">
            <div className="flex flex-wrap items-center">
              <div className="flex-basis shrink-0 grow-0 px-3 w-5/12">
                {sponsor.image && <GatsbyImage
                  className="mb-6 dark:brightness-150 lg:mb-0 h-24 object-contain"
                  image={sponsor.image.childImageSharp.gatsbyImageData}
                  alt={sponsor.name}
                  objectFit="contain"
                />}
                {sponsor.externalImage && <img
                  src={sponsor.externalImage}
                  alt={sponsor.name}
                  className="mb-6 dark:brightness-150 lg:mb-0 h-24 object-contain"
                />}
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

function BoardMemberCard({ member }: { member: BoardMember }) {
  return (
    <div className="mb-24 md:mb-0">
      <div className="block h-full rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] w-full  dark:bg-neutral-700">
        <div className="flex justify-center">
          <div className="flex justify-center -mt-[75px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="150px"
              height="150px"
              fill="currentColor"
              className="fill-primary bi bi-fire hover:animate-pulse"
              viewBox="0 0 16 16"
            >
              <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16Zm0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15Z" />
            </svg>
          </div>
        </div>
        <div className="p-6">
          <h5 className="mb-4 text-lg font-bold">{member.name}</h5>
          <p className="mb-6">{member.role}</p>
          <ul className="mx-auto flex list-inside justify-center">
            <Link to={`mailto:${member.email}`} className="px-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="h-4 w-4 text-primary dark:text-primary-400"
                viewBox="0 0 16 16"
              >
                <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2H2Zm-2 9.8V4.698l5.803 3.546L0 11.801Zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 9.671V4.697l-5.803 3.546.338.208A4.482 4.482 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671Z" />
                <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034v.21Zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791Z" />
              </svg>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Home({ data: { sponsors } }: { data: { sponsors: { nodes: Sponsor[] } } }) {
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
            {board_members.map((member, index) => <BoardMemberCard member={member} key={index} />)}
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
            {sponsors.nodes.map((sponsor, index) => <SponsorCard sponsor={sponsor} key={index} />)}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const indexQuery = graphql`
query SponsorQuery {
  sponsors: allSponsor {
    nodes {
      name
      location
      externalImage
      image {
        childImageSharp {
          gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP], layout: FULL_WIDTH)
        }
      }
    }
  }
}
`;