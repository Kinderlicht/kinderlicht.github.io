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

// export async function createSchemaCustomization({ actions }) {
// 	const { createTypes } = actions
// 	const typeDefs = `
// 	  type Mdx implements Node {
// 		frontmatter: Frontmatter
// 	  }

// 	  type Frontmatter {
// 		tags: [String!]
// 		title: String!
// 		short: String!
// 		author: String!
// 		date: Date!
// 		featuredImage: ImageSharp
// 		draft: Boolean
// 	  }
// 	`
// 	createTypes(typeDefs)
// }