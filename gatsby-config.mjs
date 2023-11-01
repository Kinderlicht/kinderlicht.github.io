// import type { GatsbyConfig } from "gatsby";

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
      resolve: "gatsby-plugin-mdx",
      options: {
        mdxOptions: {
          // remarkPlugins: [remarkGfm, remarkSmartypants],
        },
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
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
					breakpoints: [400, 750, 1080, 1366, 1920]
				}
			}
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
  ],
};

export default config;
