import React from "react";
import Layout from "../components/layout";
import { Link, graphql } from "gatsby";

function NewsEntry(news: NewsItem, index: number) {
  const link = NewsItemLink(news);
  const isNew = new Date().getTime() - news["date"].getTime() < articleIsNew;

  return (
    <Link
      rel="noopener noreferrer"
      to={link}
      className="max-w-sm mx-auto group hover:no-underline focus:no-underline dark:bg-gray-900 bg-gray-200 rounded-xl w-full"
      key={index}
    >
      {GetImageOrVideo(news, false)}
      <div className="p-6 space-y-2">
        <h3 className="text-2xl font-semibold group-hover:underline group-focus:underline">
          {news["heading"]}
        </h3>
        <span className="text-xs dark:text-gray-400">
          {ConvertDate(news["date"])}
        </span>
        {isNew && (
          <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
            Neu
          </span>
        )}
        <p dangerouslySetInnerHTML={{ __html: news["short"] }} />
      </div>
    </Link>
  );
}

const BlogIndex: React.FC<{}> = () => {
  return <Layout>jihg</Layout>;
};

export default BlogIndex;

export const indexQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allPosts: allMdx(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { draft: { ne: true } } }
    ) {
      posts: edges {
        node {
          id
          fields {
            slug
          }
          excerpt(pruneLength: 240)
          frontmatter {
            author
            title
            date
            featuredImage {
              gatsbyImageData(
                width: 1080
                height: 400
                placeholder: BLURRED
                formats: [AUTO, WEBP]
              )
            }
          }
        }
      }
    }
  }
`;
