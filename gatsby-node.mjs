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
            }
          }
        }
      }
    `);

	if (result.errors) {
		reporter.panicOnBuild(`Error while running GraphQL query.`)
		return
	}

	createPosts(result.data.allMdx.edges, createPage);
}

function createPosts(posts, createPage) {
	posts.forEach(({ node }) => {
		let context = { slug: node.fields.slug }

		const postTemplate = path.resolve(`./src/templates/blog-post.tsx`);

		createPage({
			path: node.fields.slug,
			component: `${postTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
			context: context
		});
	});
}