export type BlogPost = {
    excerpt: string;
    fields: {
      slug: string;
    };
    body: string;
    frontmatter: {
      title: string;
      author: {[key: string]: any};
      date: string;
      short: string;
      
      featuredImage?: any;
      youtube?: string;
  
      tags: [string];
      draft: boolean;
    }
  }