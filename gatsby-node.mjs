import path from "path"
import _ from "lodash";
import { createFilePath } from "gatsby-source-filesystem";
import { reporter } from "gatsby-cli/lib/reporter/reporter.js";
import authorsData from './src/content/authors.json' assert { type: 'json' };
import sponsorsData from './src/content/sponsors.json' assert { type: 'json' };
import boardData from './src/content/board.json' assert { type: 'json' };


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

export const sourceNodes = async ({ actions, getNodesByType, createNodeId, createContentDigest }) => {
	const { createNode, createTypes } = actions;

	createTypes(`
    type Mdx implements Node {
      frontmatter: Frontmatter
    }

    type Frontmatter {
      author: Author @link(from: "author", by: "id")
    }

    type Author implements Node {
		id: String!
		name: String!
		description: String!
		image: File @link(by: "relativePath")
    }

	type Sponsor implements Node {
		name: String!
		location: String!
		image: File @link(by: "relativePath")
		externalImage: String
		link: String!
	}

	type Board implements Node {
		name: String!
		location: String!
		image: File @link(by: "relativePath")
		role: String!
	}
  `);

	Object.keys(authorsData).forEach(authorId => {
		const author = authorsData[authorId];

		const node = {
			id: createNodeId(`Author-${authorId}`),
			parent: null,
			children: [],
			internal: {
				type: 'Author',
				contentDigest: createContentDigest(author),
			},
			...author,
			image: author.image,
			id: authorId,
		};

		createNode(node);
	});

	sponsorsData.forEach((sponsor, index) => {
		const nodeId = createNodeId(`Sponsor-${index}`);
		createNode({
			...sponsor,
			id: nodeId,
			parent: null,
			children: [],
			internal: {
				type: 'Sponsor',
				contentDigest: createContentDigest(sponsor),
			},
		});
	});

	boardData.forEach((board, index) => {
		const nodeId = createNodeId(`Board-${index}`);
		createNode({
			...board,
			id: nodeId,
			parent: null,
			children: [],
			internal: {
				type: 'Board',
				contentDigest: createContentDigest(board),
			},
		});
	});
};

export async function createPages({ graphql, actions }) {
	const { createPage, createRedirect } = actions;
	createRedirect({
		fromPath: `/hilf-mit/werde-mitglied`,
		toPath: `/beitreten`,
		redirectInBrowser: true,
		isPermanent: true,
	});

	createRedirect({
		fromPath: `/hilf-mit/spenden`,
		toPath: `/quittung`,
		redirectInBrowser: true,
		isPermanent: true,
	});

	createRedirect({
		fromPath: `/ueber-uns`,
		toPath: `/wie-ales-begann`,
		redirectInBrowser: true,
		isPermanent: true,
	});
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