import path from "path"
import _ from "lodash";
import { createFilePath } from "gatsby-source-filesystem";
import { reporter } from "gatsby-cli/lib/reporter/reporter.js";
import authorsData from './src/content/authors.json' with { type: 'json' };
import sponsorsData from './src/content/sponsors.json' with { type: 'json' };
import boardData from './src/content/board.json' with { type: 'json' };

const ACTIVITY_REPORTS_URL =
	"https://portal.kinderlicht-wallersdorf.de/api/activity-reports";
const ACTIVITY_REPORTS_CACHE_KEY = "activity-reports";

function isActivityReport(value) {
	if (!value || typeof value !== "object") {
		return false;
	}

	return (
		typeof value.date === "string" &&
		typeof value.donation === "number" &&
		Number.isFinite(value.donation) &&
		typeof value.title === "string" &&
		typeof value.description === "string"
	);
}

function parseActivityReports(data) {
	if (!Array.isArray(data) || !data.every(isActivityReport)) {
		throw new Error("Activity reports API returned an unexpected response.");
	}

	return data;
}

async function fetchActivityReports(cache) {
	try {
		const response = await fetch(ACTIVITY_REPORTS_URL, {
			headers: {
				Accept: "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(
				`Activity reports API responded with ${response.status} ${response.statusText}`
			);
		}

		const reports = parseActivityReports(await response.json());
		await cache.set(ACTIVITY_REPORTS_CACHE_KEY, reports);
		return reports;
	} catch (error) {
		const cachedReports = await cache.get(ACTIVITY_REPORTS_CACHE_KEY);
		const message = error instanceof Error ? error.message : String(error);

		if (Array.isArray(cachedReports) && cachedReports.every(isActivityReport)) {
			reporter.warn(
				`Could not fetch activity reports. Using cached data instead. Reason: ${message}`
			);
			return cachedReports;
		}

		reporter.warn(
			`Could not fetch activity reports. The donations timeline will be empty. Reason: ${message}`
		);
		return [];
	}
}


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

export const sourceNodes = async ({ actions, createNodeId, createContentDigest, cache }) => {
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

	type ActivityReport implements Node {
		date: String!
		donation: Float!
		title: String!
		description: String!
	}
  `);

	const activityReports = await fetchActivityReports(cache);

	activityReports.forEach((activityReport, index) => {
		const nodeId = createNodeId(`ActivityReport-${index}`);
		createNode({
			...activityReport,
			id: nodeId,
			parent: null,
			children: [],
			internal: {
				type: 'ActivityReport',
				contentDigest: createContentDigest(activityReport),
			},
		});
	});

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
