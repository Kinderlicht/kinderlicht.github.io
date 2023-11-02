import React, { useEffect, useReducer, useState } from "react";
import Layout from "../components/layout";
import { HeadFC, Link, graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import type { BlogPost } from "../types/";

const NewsEntry: React.FC<{ post: BlogPost }> = ({ post }) => {
  return (
    <Link
      rel="noopener noreferrer"
      to={post.fields.slug}
      className="max-w-sm mx-auto group hover:no-underline focus:no-underline dark:bg-gray-900 bg-gray-200 rounded-xl w-full"
    >
      <>{post.frontmatter.featuredImage && <GatsbyImage role="presentation" image={post.frontmatter.featuredImage.childImageSharp.gatsbyImageData} alt={post.frontmatter.title} className="object-cover w-full rounded h-44 dark:bg-gray-500" />}</>
      <>{post.frontmatter.youtube && <iframe
        loading="lazy"
        className="object-cover w-full rounded h-44 dark:bg-gray-500"
        src={post.frontmatter.youtube}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={post.frontmatter.title}
      />}</>
      <div className="p-6 space-y-2">
        <h3 className="text-2xl font-semibold group-hover:underline group-focus:underline">
          {post.frontmatter.title}
        </h3>
        <p className="text-xs dark:text-gray-400">
          {post.frontmatter.date}
        </p>
        <p dangerouslySetInnerHTML={{ __html: post.frontmatter.short }} />
      </div>
    </Link>
  );
};

const BlogIndex: React.FC<{ data: any }> = ({ data }) => {
  const { first: { posts }, olderPosts } = data;
  const first: BlogPost = posts[0].node;

  const className = "object-cover w-full h-64 rounded sm:h-96 lg:col-span-7 dark:bg-gray-500";
  // const articleIsNew = 1000 * 60 * 60 * 24 * 7;
  // const [isNew, setIsNew] = useState(false);

  // useEffect(() => {
  //   const isNewValue = new Date(first.frontmatter.date).getTime() + articleIsNew > new Date().getTime();
  //   setIsNew(isNewValue);

  //   console.log("Is new?", isNewValue, first)
  // }, [])

  return <Layout>
    <div className="p-4 container max-w-6xl mx-auto space-y-6 sm:space-y-12 mb-8 mt-32">
      <h2 className="mb-16 text-3xl font-bold text-center">
        Unsere{" "}
        <span className="text-primary dark:text-primary-400 no-underline">Neuigkeiten</span>
      </h2>

      <Link
        rel="noopener noreferrer"
        to={first.fields.slug}
        className="block max-w-sm gap-3 mx-auto sm:max-w-full group hover:no-underline focus:no-underline lg:grid lg:grid-cols-12 dark:bg-gray-900 bg-gray-200 rounded-xl"
      >
        <>{first.frontmatter.featuredImage && <GatsbyImage role="presentation" image={first.frontmatter.featuredImage.childImageSharp.gatsbyImageData} alt={first.frontmatter.title} className={className} />}</>
        <>{first.frontmatter.youtube && <iframe
          loading="lazy"
          className={className}
          src={first.frontmatter.youtube}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={first.frontmatter.title}
        />}</>
        <div className="p-6 space-y-2 lg:col-span-5">
          <h3 className="text-2xl font-semibold sm:text-4xl group-hover:underline group-focus:underline">
            {first.frontmatter.title}
          </h3>
          <span className="text-xs dark:text-gray-400">
            {first.frontmatter.date}
          </span>
          {/* {isNew && <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Neu</span>} */}
          <p dangerouslySetInnerHTML={{ __html: first.frontmatter.short }} />
          <p className="text-justify text-ellipsis overflow-hidden">
            {first.excerpt}
          </p>
        </div>
      </Link>

      <div className="grid justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {olderPosts.posts.map(({ node }: { node: BlogPost }, index: number) => <NewsEntry key={index} post={node} />)}
      </div>
    </div>
  </Layout>;
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
    sort: {frontmatter: {date: DESC}}
    limit: 1
    filter: {frontmatter: {draft: {ne: true}}}
  ) {
    posts: edges {
      ...PostFields
    }
  }

  olderPosts: allMdx(
    sort: {frontmatter: {date: DESC}}
    filter: {frontmatter: {draft: {ne: true}}}
    skip: 1
  ) {
    posts: edges {
      ...PostFields
    }
  }
}
`;

export const Head: HeadFC = () => <title>Kinderlicht</title>;