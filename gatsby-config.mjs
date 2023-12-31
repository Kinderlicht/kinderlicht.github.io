import remarkGfm from "remark-gfm";
import rehypeAccessibleEmojis from "rehype-accessible-emojis";
import remarkSmartypants from "remark-smartypants";

const config = {
  trailingSlash: "always",
  siteMetadata: {
    title: `Kinderlicht`,
    siteUrl: `https://www.kinderlicht-wallersdorf.de`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  // graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-postcss",
    "gatsby-plugin-image",
    "gatsby-plugin-sitemap",
    `gatsby-remark-images`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Kinderlicht Wallerdorf e.V.`,
        short_name: `Kinderlicht`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        // Generate PWA icons and a favicon
        icon: `src/images/quadratic.png`,
      },
    },
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkSmartypants],
          rehypePlugins: [
            rehypeAccessibleEmojis,
            // rehypePrism,
          ],
        },
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
              wrapperStyle: () => "margin: 5 -40px",
              withWebp: true,
              withAvif: true,
              quality: 100,
              showCaptions: true,
            },
          },
        ],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-transformer-sharp",
      options: {
        defaults: {
          stripMetadata: true,
          breakpoints: [400, 750, 1080, 1366, 1920],
        },
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "blog",
        path: "./src/content/blog/",
      },
      __key: "blog",
    },
    {
      resolve: "gatsby-plugin-netlify",
      options: {
        // Add your redirects here
        redirects: [
          {
            from: "/hilf-mit/werde-mitglied",
            to: "/beitreten",
            status: 301,
          },
          {
            from: "/hilf-mit/spenden",
            to: "/quittung",
            status: 301,
          },
          {
            from: "/ueber-uns",
            to: "/wie-ales-begann",
            status: 301,
          },
        ],
      },
    },
  ],
};

export default config;
