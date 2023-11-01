import React from "react";
import Layout from "../components/layout";
import { Link, graphql } from "gatsby";


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