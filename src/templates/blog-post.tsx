import * as React from 'react';
import { graphql, Link } from 'gatsby';
import { MDXProvider } from "@mdx-js/react"
import { compileMDX } from "gatsby-plugin-mdx"
// import mdxComponents from '../mdxComponents'
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import _ from 'lodash';
import Layout from '../components/layout';
import type { BlogPost } from "../types/";

const HeroImage = ({ post, recommended: isRecommended }: { post: BlogPost, recommended?: boolean, }) => {
    let className = isRecommended
        ? "object-cover w-full rounded h-44 dark:bg-gray-500"
        : "object-cover w-full mb-8 rounded lg:col-span-7 dark:bg-gray-500";

    if (!isRecommended) {
        className += " h-72";
    }

    return (
        <>
            {post.frontmatter.youtube ? (
                <iframe
                    className={className}
                    src={post.frontmatter.youtube}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={post.frontmatter.title}
                />
            ) : (
                <GatsbyImage
                    role="presentation"
                    image={post.frontmatter.featuredImage.childImageSharp.gatsbyImageData}
                    alt={post.frontmatter.title}
                    className={className} />
            )}
        </>
    );
}

export default function Post({ data: { mdx: post }, pageContext, children }: { data: { mdx: BlogPost }, pageContext: any, children: any }) {
    return <Layout>
        <section className="container">
            <main  className="bg-white dark:bg-gray-900 antialiased">
                <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
                    <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                        <header className="mb-4 lg:mb-6 not-format">
                            {post.frontmatter.author && false && (
                                <address className="flex items-center mb-6 not-italic">
                                    <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                                        <img
                                            className="mr-4 h-16 rounded-full"
                                            src={author.image}
                                            alt={author.name}
                                        ></img>
                                        <div>
                                            <p
                                                rel="author"
                                                className="text-xl font-bold text-gray-900 dark:text-white"
                                            >
                                                {author.name}
                                            </p>
                                            <p className="text-base text-gray-500 dark:text-gray-400">
                                                {author.description}
                                            </p>
                                            <p className="text-base text-gray-500 dark:text-gray-400">
                                                <time>{ConvertDate(item["date"])}</time>
                                            </p>
                                        </div>
                                    </div>
                                </address>
                            )}
                            <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
                                {post.frontmatter.title}
                            </h1>
                        </header>
                        <HeroImage post={post} recommended={false} />
                        <MDXProvider>
                            {children}
                        </MDXProvider>
                    </article>
                </div>
            </main></section>

    </Layout>;
}

export const pageQuery = graphql`
  query BlogPostQuery($slug: String) {
    mdx(fields: { slug: {eq: $slug }}) {
      id
      body
      excerpt
      frontmatter {
        title
        date(formatString: "LL")
        author
        tags
        featuredImage {
          publicURL
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
`