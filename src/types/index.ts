export type BlogPost = {
    excerpt: string;
    fields: {
      slug: string;
    };
    body: string;
    frontmatter: {
      title: string;
      author: string;
      date: string;
      short: string;
      
      featuredImage?: any;
      youtube?: string;
  
      tags: [string];
      draft: boolean;
    }
  }