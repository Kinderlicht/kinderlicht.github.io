export type BlogPost = {
  excerpt: string;
  fields: {
    slug: string;
  };
  body: string;
  frontmatter: {
    title: string;
    author: { [key: string]: any };
    date: string;
    dateRaw?: string;
    short: string;

    featuredImage?: any;
    thumbnailPositionX?: number | null;
    thumbnailPositionY?: number | null;
    youtube?: string;

    tags: [string];
    draft: boolean;
  };
};
