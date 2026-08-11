import React from "react";
import "../styles/global.css";
import Layout from "../components/layout";
import { HeadFC, Link, PageProps, graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import type { BlogPost } from "../types/";
import Timeline from "../components/timeline";
import type { ActivityReport } from "../content/donations";

type BlogIndexData = {
  first: {
    posts: Array<{
      node: BlogPost;
    }>;
  };
  olderPosts: {
    posts: Array<{
      node: BlogPost;
    }>;
  };
  activityReports: {
    nodes: ActivityReport[];
  };
};

const NewsEntry: React.FC<{ post: BlogPost }> = ({ post }) => {
  return (
    <article className="mx-auto w-full max-w-sm overflow-hidden rounded-xl bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <>
        {post.frontmatter.featuredImage && (
          <GatsbyImage
            image={
              post.frontmatter.featuredImage.childImageSharp.gatsbyImageData
            }
            alt=""
            className="object-cover w-full h-44 dark:bg-gray-500"
          />
        )}
      </>
      <>
        {post.frontmatter.youtube && (
          <iframe
            loading="lazy"
            className="object-cover w-full h-44 dark:bg-gray-500"
            src={post.frontmatter.youtube}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`Video zum Beitrag: ${post.frontmatter.title}`}
          />
        )}
      </>
      <div className="p-6 space-y-2">
        <h2 className="text-2xl font-semibold">
          <Link
            to={post.fields.slug}
            className="rounded-sm underline decoration-gray-400 underline-offset-4 hover:decoration-orange-700"
          >
            {post.frontmatter.title}
          </Link>
        </h2>
        <time
          dateTime={post.frontmatter.dateRaw}
          className="block text-sm text-gray-600 dark:text-gray-300"
        >
          {post.frontmatter.date}
        </time>
        <p dangerouslySetInnerHTML={{ __html: post.frontmatter.short }} />
      </div>
    </article>
  );
};

const BlogIndex: React.FC<PageProps<BlogIndexData>> = ({ data }) => {
  const {
    first: { posts },
    olderPosts,
    activityReports,
  } = data;
  const first: BlogPost = posts[0].node;
  const activities = activityReports.nodes;

  const className =
    "object-cover w-full h-64 rounded sm:h-96 lg:col-span-7 dark:bg-gray-500";

  return (
    <Layout>
      <div className="p-4 container max-w-6xl mx-auto space-y-6 sm:space-y-12 mb-8 mt-32">
        <h1 className="mb-16 text-3xl font-bold text-center">
          Unsere{" "}
          <span className="text-orange-700 dark:text-orange-400 no-underline">
            Neuigkeiten
          </span>
        </h1>

        <Timeline activities={activities} />

        <article className="mx-auto block max-w-sm gap-3 overflow-hidden rounded-xl bg-gray-100 text-gray-900 sm:max-w-full lg:grid lg:grid-cols-12 dark:bg-gray-900 dark:text-gray-100">
          <>
            {first.frontmatter.featuredImage && (
              <GatsbyImage
                image={
                  first.frontmatter.featuredImage.childImageSharp
                    .gatsbyImageData
                }
                alt=""
                className={className}
              />
            )}
          </>
          <>
            {first.frontmatter.youtube && (
              <iframe
                loading="lazy"
                className={className}
                src={first.frontmatter.youtube}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`Video zum Beitrag: ${first.frontmatter.title}`}
              />
            )}
          </>
          <div className="p-6 space-y-2 lg:col-span-5">
            <h2 className="text-2xl font-semibold sm:text-4xl">
              <Link
                to={first.fields.slug}
                className="rounded-sm underline decoration-gray-400 underline-offset-4 hover:decoration-orange-700"
              >
                {first.frontmatter.title}
              </Link>
            </h2>
            <time
              dateTime={first.frontmatter.dateRaw}
              className="block text-sm text-gray-600 dark:text-gray-300"
            >
              {first.frontmatter.date}
            </time>
            {/* {isNew && <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Neu</span>} */}
            <p dangerouslySetInnerHTML={{ __html: first.frontmatter.short }} />
            <p className="text-justify text-ellipsis overflow-hidden">
              {first.excerpt}
            </p>
          </div>
        </article>

        <div className="grid justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {olderPosts.posts.map(
            ({ node }: { node: BlogPost }, index: number) => (
              <NewsEntry key={index} post={node} />
            ),
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogIndex;

export const indexQuery = graphql`
  fragment PostFields on MdxEdge {
    node {
      id
      fields {
        slug
      }
      frontmatter {
        short
        title
        youtube
        date(formatString: "DD. MMMM YYYY", locale: "de")
        dateRaw: date(formatString: "YYYY-MM-DD")
        featuredImage {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP])
          }
        }
      }
    }
  }

  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }

    first: allMdx(
      sort: { frontmatter: { date: DESC } }
      limit: 1
      filter: { frontmatter: { draft: { ne: true } } }
    ) {
      posts: edges {
        ...PostFields
      }
    }

    olderPosts: allMdx(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { draft: { ne: true } } }
      skip: 1
    ) {
      posts: edges {
        ...PostFields
      }
    }

    activityReports: allActivityReport(sort: { date: ASC }) {
      nodes {
        date
        donation
        title
        description
      }
    }
  }
`;

export const Head: HeadFC = () => (
  <title>Neuigkeiten | Kinderlicht Wallersdorf</title>
);
