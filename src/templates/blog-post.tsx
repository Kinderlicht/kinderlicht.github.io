import * as React from 'react';
import { graphql, HeadFC, Link } from 'gatsby';
import { MDXProvider } from "@mdx-js/react"
import { compileMDX } from "gatsby-plugin-mdx"
// import mdxComponents from '../mdxComponents'
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import _ from 'lodash';
import Layout from '../components/layout';
import type { BlogPost } from "../types/";

const HeroImage = ({ post }: { post: BlogPost }) => {
    return (
        <>
            {post.frontmatter.youtube ? (
                <iframe
                    loading='lazy'
                    className="object-cover w-full mb-8 rounded-lg lg:col-span-7 dark:bg-gray-500 h-96"
                    src={post.frontmatter.youtube}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={post.frontmatter.title}
                />
            ) : (
                <GatsbyImage
                    role="presentation"
                    image={post.frontmatter.featuredImage?.childImageSharp?.gatsbyImageData}
                    alt={post.frontmatter.title}
                    className="object-cover mb-8 rounded-lg lg:col-span-7 dark:bg-gray-500 w-full" />
            )}
        </>
    );
}

export default function Post({ data: { mdx: post }, pageContext, children }: { data: { mdx: BlogPost }, pageContext: any, children: any }) {
    return <Layout>
        <section className="p-4 container max-w-6xl mx-auto space-y-6 sm:space-y-12 mb-12 mt-32">
            <main className="bg-white dark:bg-gray-900 antialiased">
                <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
                    <article className="mx-auto w-full container">
                        <div className="mx-auto prose dark:prose-dark lg:prose-xl prose-slate">
                            <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
                                {post.frontmatter.title}
                            </h1>
                            <header className="mb-4 lg:mb-6 not-format">
                            {post.frontmatter.author && (
                                <address className="flex items-center not-italic bg-gray-100 rounded-lg">
                                    <div className="ml-8 inline-flex items-center text-sm text-gray-900 dark:text-white">
                                        <GatsbyImage
                                            className="mr-4 h-16 rounded-full"
                                            image={post.frontmatter.author.image?.childImageSharp?.gatsbyImageData}
                                            alt={post.frontmatter.author.name}
                                        />
                                        <p className='container'>
                                            <span
                                                rel="author"
                                                className="block text-xl font-bold text-gray-900 dark:text-white"
                                            >
                                                {post.frontmatter.author.name}
                                            </span>
                                            <span className="block text-base text-gray-500 dark:text-gray-400">
                                                {post.frontmatter.author.description}
                                            </span>
                                            <span className="block text-base text-gray-500 dark:text-gray-400">
                                                <time>{post.frontmatter.date}</time>
                                            </span>
                                        </p>
                                    </div>
                                </address>
                            )}
                        </header>
                            <HeroImage post={post} />
                            <MDXProvider>
                                {children}
                            </MDXProvider>
                        </div>
                    </article>
                </div>
            </main></section>

    </Layout>;
}

export const Head: HeadFC<any> = ({ data }) => <><title>{data.mdx.frontmatter.title} - Kinderlicht</title></>;

export const pageQuery = graphql`
  query BlogPostQuery($slug: String) {
    mdx(fields: { slug: {eq: $slug }}) {
      id
      body
      excerpt
      frontmatter {
        title
        date(formatString: "LL")
        tags
        author {
            name
            description
            image {
                childImageSharp {
                    gatsbyImageData(placeholder: TRACED_SVG, formats: [AUTO, WEBP], width: 64, height: 64)
                  }
            }
        }
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