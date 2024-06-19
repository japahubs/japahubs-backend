
export interface PostDTO {
  id?: string,
  authorId: string;
  slug: string;
  caption: string;
  link: string;
  images: string[];
  totalNumViews: number;
  totalNumLikes: number;
  totalNumComments: number;
  createdAt: string;
}

