import * as React from "react";
import { graphql, HeadFC } from "gatsby";
import { MDXProvider } from "@mdx-js/react";
import { GatsbyImage } from "gatsby-plugin-image";
import Layout from "../components/layout";
import type { BlogPost } from "../types/";

const HeroImage = ({ post }: { post: BlogPost }) => {
  return (
    <>
      {post.frontmatter.youtube ? (
        <iframe
          loading="lazy"
          className="mb-8 h-96 w-full rounded-xl object-cover lg:col-span-7"
          src={post.frontmatter.youtube}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={`Video zum Beitrag: ${post.frontmatter.title}`}
        />
      ) : (
        <GatsbyImage
          image={
            post.frontmatter.featuredImage?.childImageSharp?.gatsbyImageData
          }
          alt={`Beitragsbild zu „${post.frontmatter.title}“`}
          className="mb-8 w-full rounded-xl object-cover lg:col-span-7"
        />
      )}
    </>
  );
};

export default function Post({
  data: { mdx: post },
  children,
}: {
  data: { mdx: BlogPost };
  children: any;
}) {
  return (
    <Layout>
      <section className="site-page max-w-4xl">
        <article className="site-card p-6 sm:p-10">
          <div className="prose prose-slate mx-auto max-w-none lg:prose-lg">
            <h1 className="mb-4 text-3xl font-bold leading-tight text-slate-950 lg:mb-6 lg:text-4xl">
              {post.frontmatter.title}
            </h1>
            <header className="mb-4 lg:mb-6 not-format">
              {post.frontmatter.author && (
                <address className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-4 not-italic">
                  <div className="inline-flex items-center text-sm text-slate-900">
                    <GatsbyImage
                      className="mr-4 h-16 w-16 flex-none rounded-full"
                      image={
                        post.frontmatter.author.image?.childImageSharp
                          ?.gatsbyImageData
                      }
                      alt={`Porträt von ${post.frontmatter.author.name}`}
                    />
                    <p className="container">
                      <span
                        rel="author"
                        className="block text-lg font-bold text-slate-900"
                      >
                        {post.frontmatter.author.name}
                      </span>
                      <span className="block text-sm text-slate-600">
                        {post.frontmatter.author.description}
                      </span>
                      <span className="block text-sm text-slate-600">
                        <time dateTime={post.frontmatter.dateRaw}>
                          {post.frontmatter.date}
                        </time>
                      </span>
                    </p>
                  </div>
                </address>
              )}
            </header>
            <HeroImage post={post} />
            <MDXProvider>{children}</MDXProvider>
          </div>
        </article>
      </section>
    </Layout>
  );
}

export const Head: HeadFC<any> = ({ data }) => (
  <>
    <title>{data.mdx.frontmatter.title} - Kinderlicht</title>
  </>
);

export const pageQuery = graphql`
  query BlogPostQuery($slug: String) {
    mdx(fields: { slug: { eq: $slug } }) {
      id
      body
      excerpt
      frontmatter {
        title
        date(formatString: "LL")
        dateRaw: date(formatString: "YYYY-MM-DD")
        tags
        youtube
        author {
          name
          description
          image {
            childImageSharp {
              gatsbyImageData(
                placeholder: TRACED_SVG
                formats: [AUTO, WEBP]
                width: 64
                height: 64
              )
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
`;
