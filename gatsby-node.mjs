import path from "path"
import _ from "lodash";
import { createFilePath } from "gatsby-source-filesystem";
import { reporter } from "gatsby-cli/lib/reporter/reporter.js";


export async function onCreateNode({ node, getNode, actions }) {
	const { createNodeField } = actions;

	if (node.internal.type === `Mdx`) {
		const slug = createFilePath({ node, getNode, basePath: `blog` });

		createNodeField({
			node,
			name: `slug`,
			value: slug,
		});
	}
}

export async function createPages({ graphql, actions }) {
	const { createPage } = actions;
	const result = await graphql(`
      query {
        allMdx(filter: {frontmatter: {draft: {ne: true}}}) {
          edges {
            node {
				fields {
                	slug
				}
				internal {
					contentFilePath
				}
				frontmatter {
					title
					category
					tags
				}
            }
          }
        }
		tagsGroup: allMdx(filter: {frontmatter: {draft: {ne: true}}}, limit: 2000) {
			group(field: {frontmatter: {tags: SELECT}}) {
			  	fieldValue
			}
		}
      }
    `);

	if (result.errors) {
		reporter.panicOnBuild(`Error while running GraphQL query.`)
		return
	}

	createPosts(result.data.allMdx.edges, createPage);
	createTagPages(result.data.tagsGroup.group, createPage);
}

export async function createSchemaCustomization({ actions }) {
	console.log("\n\n\n\n\n\n\n\n\n\n\nFUUUUUUUUUUUUUCK\n\n\n\n\n\n\n\n");

	const { createTypes } = actions
	const typeDefs = `
	  type Mdx implements Node {
		frontmatter: Frontmatter
	  }

	  type Frontmatter {
		tags: [String!]
		title: String!
		short: String!
		author: String!
		date: Date!
		featuredImage: ImageSharp
		draft: Boolean
	  }
	`
	createTypes(typeDefs)
}

function createPosts(posts, createPage) {
	const series = posts.reduce((acc, post) => {
		if(!!post.node.frontmatter.series) {
			if(!acc[post.node.frontmatter.series.name]) {
				acc[post.node.frontmatter.series.name] = {};
			} 
			
			if(!!acc[post.node.frontmatter.series.name][post.node.frontmatter.series.part]) {
				reporter.warn(`Multiple articles with the same part number in a series: ${acc[post.node.frontmatter.series.name][post.node.frontmatter.series.part].fields.slug} and ${post.node.fields.slug}.`);
			}

			acc[post.node.frontmatter.series.name][post.node.frontmatter.series.part] = post.node;
		}

		return acc;
	}, {});

	posts.forEach(({ node }) => {
		let context = { slug: node.fields.slug }

		if(!!node.frontmatter.series) {
			context = {
				...context,
				previous: series[node.frontmatter.series.name][node.frontmatter.series.part - 1],
				next: series[node.frontmatter.series.name][node.frontmatter.series.part + 1],
			};
		}

		const postTemplate = path.resolve(`./src/templates/blog-post.tsx`);

		createPage({
			path: node.fields.slug,
			// component: path.resolve(`./src/templates/blog-post.tsx`),
			component: `${postTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
			context: context
		});
	});
}

function createTagPages(tags, createPage) {
	// Make tag pages
	tags.forEach(tag => {
		createPage({
			path: `/tags/${_.kebabCase(_.replace(_.replace(tag.fieldValue, /c#/gi, "csharp"), /c\+\+/gi, "cpp"))}/`,
			component: path.resolve(`./src/templates/tags.tsx`),
			context: {
				tag: tag.fieldValue,
			},
		})
	})
}